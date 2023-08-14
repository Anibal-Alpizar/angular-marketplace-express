import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAddress = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      province,
      canton,
      district,
      exactAddress,
      postalCode,
      phone,
    } = req.body;

    const newAddress = await prisma.address.create({
      data: {
        UserId: userId,
        Province: province,
        Canton: canton,
        District: district,
        ExactAddress: exactAddress,
        PostalCode: postalCode,
        Phone: phone,
      },
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating address" });
  }
};

export const getAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const addresses = await prisma.address.findMany({
      where: {
        UserId: userId,
      },
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};
