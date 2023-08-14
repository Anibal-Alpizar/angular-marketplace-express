import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const paymentMethodData = req.body;

    const user = await prisma.user.findUnique({
      where: { UserId: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let newPaymentMethodData: Prisma.PaymentMethodCreateInput = {
      User: { connect: { UserId: parseInt(userId) } },
      PaymentType: paymentMethodData.paymentType,
      AccountNumber: paymentMethodData.accountNumber,
      ExpirationMonth: paymentMethodData.expirationMonth as string,
      ExpirationYear: paymentMethodData.expirationYear,
      Cvc: paymentMethodData.cvc,
    };

    if (paymentMethodData.paymentType === "PayPal") {
      newPaymentMethodData = {
        ...newPaymentMethodData,
        ExpirationMonth: "",
        ExpirationYear: "",
        Cvc: "",
      };
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: newPaymentMethodData,
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error("Error registrando metodo de pago:", error);
    res
      .status(500)
      .json({ error: "A ocurrido un error al registrar el metodo de pago" });
  }
};

export const getPaymentMethodsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const userPaymentMethods = await prisma.paymentMethod.findMany({
      where: { UserId: parseInt(userId) },
    });

    res.status(200).json(userPaymentMethods);
  } catch (error) {
    console.error("Error obteniendo metodos de pago del usuario:", error);
    res
      .status(500)
      .json({ error: "A ocurrido un error al obtener los metodos de pago" });
  }
};
