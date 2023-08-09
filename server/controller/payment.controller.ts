import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerPaymentMethods = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const paymentMethodsData = req.body;

    const user = await prisma.user.findUnique({
      where: { UserId: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const paymentMethods = await Promise.all(
      paymentMethodsData.map(async (data: any) => {
        let paymentMethodData: Prisma.PaymentMethodCreateInput = {
          User: { connect: { UserId: parseInt(userId) } },
          PaymentType: data.paymentType,
          AccountNumber: data.accountNumber,
          ExpirationMonth: data.expirationMonth as string,
          ExpirationYear: data.expirationYear,
          Cvc: data.cvc,
        };

        if (data.paymentType === "PayPal") {
          // Omit properties if payment type is PayPal
          paymentMethodData = {
            ...paymentMethodData,
            ExpirationMonth: "",
            ExpirationYear: "",
            Cvc: "",
          };
        }

        return await prisma.paymentMethod.create({
          data: paymentMethodData,
        });
      })
    );

    res.status(201).json(paymentMethods);
  } catch (error) {
    console.error("Error registering payment method:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering payment method" });
  }
};
