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

export const getTopProductsByMonth = async (req: Request, res: Response) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  try {
    const result: any = await prisma.$queryRaw(
      Prisma.sql`
      SELECT 
        p.ProductId, 
        pr.ProductName,
        SUM(p.Quantity) AS TotalQuantity
      FROM 
        Purchase p
      JOIN
        Product pr ON p.ProductId = pr.ProductId
      WHERE 
        MONTH(p.PurchaseDate) = ${currentMonth} AND YEAR(p.PurchaseDate) = ${currentYear}
      GROUP BY 
        p.ProductId, pr.ProductName
      ORDER BY 
        TotalQuantity DESC
      LIMIT 
        5;
    `
    );
    
    const formattedResult = result.map((item: any) => ({
      ProductId: item.ProductId,
      ProductName: item.ProductName,
      TotalQuantity: parseInt(item.TotalQuantity),
    }));

    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
};
