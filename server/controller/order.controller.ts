import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      paymentMethodId,
      addressId,
      purchaseItems,
      totalAmount,
      taxAmount,
    } = req.body;

    const purchaseItemsData = purchaseItems.map((item: any) => ({
      Product: { connect: { ProductId: item.productId } },
      Quantity: item.quantity,
      Subtotal: item.subtotal,
      PurchaseStatus: "Pending",
    }));

    const orderData: any = {
      User: {
        connect: {
          UserId: userId,
        },
      },
      PaymentMethod: {
        connect: {
          PaymentMethodId: paymentMethodId,
        },
      },
      Address: {
        connect: {
          AddressId: addressId,
        },
      },
      TotalAmount: totalAmount,
      TaxAmount: taxAmount,
      PurchaseStatus: "Pending",
      PurchaseItems: {
        create: purchaseItemsData,
      },
    };

    const createdOrder = await prisma.purchase.create({
      data: orderData,
      include: {
        User: true,
        Address: true,
        PaymentMethod: true,
        PurchaseItems: {
          include: {
            Product: true,
          },
        },
      },
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};
