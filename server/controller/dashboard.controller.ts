import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getSalesPerDay = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw<
      [{ CantidadDeCompras: Prisma.Decimal }]
    >(
      Prisma.sql`SELECT COUNT(*) AS CantidadDeCompras FROM Purchase WHERE DATE(PurchaseDate) = CURDATE();`
    );

    const cantidadDeCompras = result[0]?.CantidadDeCompras?.toString() || "0"; 

    res.json({ cantidadDeCompras });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching sales data." });
  }
};
