import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const orderData = req.body;

  try {
    const order = await prisma.purchase.create({
      data: {
        User: { connect: { UserId: orderData.UserId } },
        PaymentMethod: {
          connect: { PaymentMethodId: orderData.PaymentMethodId },
        },
        Address: { connect: { AddressId: orderData.AddressId } },
        TotalAmount: orderData.TotalAmount,
        TaxAmount: orderData.TaxAmount,
        PurchaseDate: orderData.PurchaseDate,
        PurchaseStatus: orderData.PurchaseStatus,
        PurchaseItems: {
          create: orderData.PurchaseItems.map((item: any) => ({
            Product: { connect: { ProductId: item.ProductId } },
            Quantity: item.Quantity,
            Subtotal: item.Subtotal,
            PurchaseStatus: item.PurchaseStatus,
          })),
        },
      },

      include: {
        User: true,
        PaymentMethod: true,
        Address: true,
        PurchaseItems: {
          include: {
            Product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};
