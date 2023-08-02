import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
  ExtendedUserData,
  createUser,
  generateVerificationCode,
} from "./user/userLogic";
import { sendVerificationEmail } from "./user/emailService";
import { sendResponse } from "../utils/sendResponse";

const prisma = new PrismaClient();
dotenv.config();

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
    return sendResponse(
      res,
      500,
      false,
      "Error creating user: " + error.message
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await prisma.user.findUnique({
    where: {
      Email: userData.email,
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
    res.status(401).send({
      status: false,
      message: "The email doesn't exist",
    });
  } else {
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.Password
    );

    if (!isPasswordValid) {
      res.status(401).send({
        status: false,
        message: "Invalid password",
      });
      return;
    }

    const payload = {
      email: user.Email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const roleNames = user.Roles.map((userRole) => userRole.Role.RoleName);

    res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        user: {
          ...user,
          Roles: roleNames,
        },
        token,
      },
    });
  }
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
