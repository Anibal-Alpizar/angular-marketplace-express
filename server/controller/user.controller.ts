import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const userData = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(userData.password, salt);

  // Find the UserRole objects that match the provided role names
  const roles = await prisma.role.findMany({
    where: {
      RoleName: { in: userData.roles },
    },
  });

  // Create the user and associate the roles
  const user = await prisma.user.create({
    data: {
      FullName: userData.fullName,
      Identification: userData.identification,
      PhoneNumber: userData.phoneNumber,
      Email: userData.email,
      Password: hash,
      IsActive: true,
      Address: userData.address,
      Roles: {
        connect: roles.map((role) => ({ id: role.RoleId })), 
      },
      Addresses: userData.addresses,
    },
  });

  res.status(200).json({
    status: true,
    message: "User created successfully",
    data: user,
  });
};
