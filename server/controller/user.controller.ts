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
      Proveedor: userData.Proveedor,
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

  if (user.IsActive !== false) {
    return sendResponse(
      res,
      401,
      false,
      "Authentication failed. The account is not active."
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

export const getUsersWithRoles = async (req: Request, res: Response) => {
  try {
    const usersWithRoles = await prisma.user.findMany({
      include: {
        Roles: {
          include: {
            Role: true,
          },
        },
      },
    });

    const formattedUsers = usersWithRoles.map((user) => ({
      UserId: user.UserId,
      FullName: user.FullName,
      Identification: user.Identification,
      PhoneNumber: user.PhoneNumber,
      Email: user.Email,
      Address: user.Address,
      IsActive: user.IsActive,
      Roles: user.Roles.map((userRole) => userRole.Role.RoleName),
    }));

    return sendResponse(
      res,
      200,
      true,
      "Users with roles retrieved successfully.",
      formattedUsers
    );
  } catch ({ message }: any) {
    console.error("Error fetching users with roles:", message);
    return sendResponse(
      res,
      500,
      false,
      "Error fetching users with roles: " + message
    );
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId, isActive } = req.body;

  // Validar los datos recibidos
  if (!userId || isActive === undefined) {
    return sendResponse(res, 400, false, "userId and isActive are required.");
  }

  try {
    // Buscar al usuario por su ID
    const user = await prisma.user.findUnique({
      where: {
        UserId: userId,
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
      return sendResponse(res, 404, false, "User not found.");
    }

    // Actualizar el estado del usuario
    await prisma.user.update({
      where: {
        UserId: userId,
      },
      data: {
        IsActive: isActive,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: {
        UserId: userId,
      },
      include: {
        Roles: {
          include: {
            Role: true,
          },
        },
      },
    });

    if (!updatedUser) {
      return sendResponse(res, 500, false, "Error fetching updated user.");
    }

    const formattedUser = {
      UserId: updatedUser.UserId,
      FullName: updatedUser.FullName,
      Identification: updatedUser.Identification,
      PhoneNumber: updatedUser.PhoneNumber,
      Email: updatedUser.Email,
      Address: updatedUser.Address,
      IsActive: updatedUser.IsActive,
      Roles: updatedUser.Roles.map((userRole) => userRole.Role.RoleName),
    };

    return sendResponse(
      res,
      200,
      true,
      "User status updated successfully.",
      formattedUser
    );
  } catch (error: any) {
    console.error("Error updating user status:", error.message);
    return sendResponse(
      res,
      500,
      false,
      "Error updating user status: " + error.message
    );
  }
};
