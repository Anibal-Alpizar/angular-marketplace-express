import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User with this email already exists",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
