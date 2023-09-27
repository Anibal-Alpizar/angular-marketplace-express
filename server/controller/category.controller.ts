import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ups! Sucedio un error" });
  }



  
};
