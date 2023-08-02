import { PrismaClient } from "@prisma/client";
import { Request, Response, response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Prisma, UserRole, Address } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const userData = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(userData.password, salt);

  const existingUser = await prisma.user.findUnique({
    where: {
      Email: userData.email,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      status: false,
      message: "User with this email already exists",
    });
  }

  const user = await prisma.user.create({
    data: {
      FullName: userData.fullName,
      Identification: userData.identification,
      PhoneNumber: userData.phoneNumber,
      Email: userData.email,
      Password: hash,
      IsActive: true,
      Address: userData.address,
    },
  });

  const roles = Array.isArray(userData.role) ? userData.role : [userData.role];

  for (const roleId of roles as number[]) {
    await prisma.userRole.create({
      data: {
        UserId: user.UserId,
        RoleId: roleId,
      },
    });
  }

  res.status(200).json({
    status: true,
    message: "User created successfully",
    data: user,
  });
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
