import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const confirmarOrder = async (req: Request, res: Response) => {
  try {
    const { userId, paymentMethodId, addressId, purchaseItems } = req.body;

    const purchaseItemsData = purchaseItems.map((item: any) => ({
      Product: { connect: { ProductId: item.productId } },
      Quantity: item.quantity,
      Subtotal: item.subtotal,
      PurchaseStatus: "Pending",
    }));

    // Calcular el TotalAmount sumando los subtotales de los PurchaseItems y los precios de los productos
    const totalAmountWithoutTax = purchaseItems.reduce(
      (acc: number, item: any) => acc + item.subtotal + item.product.Price,
      0
    );

    // Calcular el impuesto (tax) del 13% del TotalAmount
    const taxAmount = totalAmountWithoutTax * 0.13;

    // Calcular el TotalAmount sumando los subtotales, el Price de los productos y el impuesto
    const totalAmount = totalAmountWithoutTax + taxAmount;

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
      PurchaseDate: new Date(),
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

export const createOrder = async (req: Request, res: Response) => {
  // const purchase = req.body;
  const {
    userId,
    paymentMethodId,
    addressId,
    PurchaseStatus,
    totalAmount,
    PurchaseDate,
  } = req.body;

  try {
    const newPurchase = await prisma.purchase.create({
      data: {
        TotalAmount: totalAmount,
        TaxAmount: 200.0,
        PurchaseDate: PurchaseDate,
        PurchaseStatus: PurchaseStatus,
        User: { connect: { UserId: userId } },
        PaymentMethod: { connect: { PaymentMethodId: paymentMethodId } },
        Address: { connect: { AddressId: addressId } },
      },
    });

    if (newPurchase === null) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    res.json(newPurchase);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
