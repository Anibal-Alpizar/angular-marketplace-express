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
import { generateAuthToken } from "../utils/utils";
import { validationResult } from "express-validator";

export const prisma = new PrismaClient();
dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await sendResponse(
        res,
        400,
        false,
        "Validation error",
        null,
        null
      );
    }

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
      const error = new Error("The email doesn't exist");
      return await sendResponse(
        res,
        401,
        false,
        "Error en el inicio de sesión",
        null,
        error
      );
    }
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.Password
    );

    if (!isPasswordValid) {
      return await sendResponse(
        res,
        401,
        false,
        "Invalid password",
        null,
        null
      );
    }

    const token = generateAuthToken(user.Email);

    return await sendResponse(
      res,
      200,
      true,
      "Login successful",
      { user, token },
      null
    );
  } catch (error: any) {
    console.error("Error en el inicio de sesión:", error.message);
    return await sendResponse(
      res,
      500,
      false,
      "Error en el inicio de sesión",
      null,
      error
    );
  }
};

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

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
export { createUser };
