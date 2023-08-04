import { PrismaClient } from "@prisma/client";
import { Request, Response, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendResponse } from "../utils/sendResponse";
import { sendVerificationEmail } from "./user/emailService";
import {
  ExtendedUserData,
  createUser,
  generateVerificationCode,
} from "./user/userLogic";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const userData: ExtendedUserData = req.body;

  if (
    !userData.fullName ||
    !userData.identification ||
    !userData.phoneNumber ||
    !userData.email ||
    !userData.password ||
    !userData.address
  ) {
    return sendResponse(res, 400, false, "All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return sendResponse(res, 400, false, "Invalid email address.");
  }

  try {
    const verificationCode = generateVerificationCode();

    const token = jwt.sign(
      { email: userData.email },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "1d",
      }
    );

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);

    const user = await createUser({
      ...userData,
      password: hash,
      verificationCode,
      verificationToken: token,
      isActive: false,
    });

    const roles = Array.isArray(userData.role)
      ? userData.role
      : [userData.role];

    for (const roleId of roles as number[]) {
      await prisma.userRole.create({
        data: {
          UserId: user.UserId,
          RoleId: roleId,
        },
      });
    }

    const selectedData = {
      FullName: userData.fullName,
      Identification: userData.identification,
      PhoneNumber: userData.phoneNumber,
      Email: userData.email,
      Address: userData.address,
    };

    await sendVerificationEmail(userData.email, verificationCode, selectedData);

    return sendResponse(
      res,
      200,
      true,
      "Verification email sent. Please check your inbox and confirm your email address.",
      user
    );
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    return sendResponse(
      res,
      500,
      false,
      "Error creating user: " + error.message
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, 400, false, "Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: {
      Email: email,
    },
    include: {
      Roles: {
        include: {
          Role: true,
        },
      },
    },
  });

  if (!user) {
    return sendResponse(
      res,
      401,
      false,
      "Authentication failed. The email doesn't exist."
    );
  }

  const isPasswordValid = bcrypt.compareSync(password, user.Password);

  if (!isPasswordValid) {
    return sendResponse(
      res,
      401,
      false,
      "Authentication failed. Invalid password."
    );
  }

  const payload = {
    email: user.Email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const roleNames = user.Roles.map((userRole) => userRole.Role.RoleName);

  return sendResponse(res, 200, true, "Login successful", {
    user: {
      ...user,
      Roles: roleNames,
    },
    token,
  });
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
