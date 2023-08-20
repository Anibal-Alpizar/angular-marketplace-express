import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";

const prisma = new PrismaClient();

export const createEvaluation = async (req: Request, res: Response) => {
  const { userId, rating, comment, PurchaseId } = req.body;

  if (!userId || !rating || !comment || !PurchaseId) {
    return sendResponse(
      res,
      400,
      false,
      "User ID, rating, comment, and Purchase ID are required."
    );
  }

  if (rating < 1 || rating > 5) {
    return sendResponse(res, 400, false, "Rating must be between 1 and 5.");
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { UserId: userId } });

    if (!user) {
      return sendResponse(res, 404, false, "User not found.");
    }

    // Check if the purchase exists
    const purchase = await prisma.purchase.findUnique({
      where: { PurchaseId: PurchaseId },
    });

    if (!purchase) {
      return sendResponse(res, 404, false, "Purchase not found.");
    }

    // Create the evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        UserId: userId,
        Rating: rating,
        Comment: comment,
        PurchaseId: PurchaseId,
      },
    });

    return sendResponse(
      res,
      200,
      true,
      "Evaluation created successfully.",
      evaluation
    );
  } catch (error: any) {
    console.error("Error creating evaluation:", error.message);
    return sendResponse(
      res,
      500,
      false,
      "Error creating evaluation: " + error.message
    );
  }
};
