import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPurchaseItems = (req: Request, res: Response) => {
    const purchaseItems = prisma.purchaseItem.findMany({
        select: {
            PurchaseItemId: true,
            PurchaseId: true,
            ProductId: true,
            Quantity: true,
            Subtotal: true,
            PurchaseStatus: true,
        },
        
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });

    if (!purchaseItems) {
        return res.status(404).json({ message: "No products found" });
      }
};