import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";

const prisma = new PrismaClient();

//Funtion about to create a new Questions
export const createQuestions = async (req: Request, res: Response) => {
  let questionData = req.body;

  questionData.ProductId = Number(questionData.ProductId);
  questionData.UserId = Number(questionData.UserId);

  try {
    const newQuestion = await prisma.question.create({
      data: {
        QuestionText: questionData.QuestionText,
        Product: { connect: { ProductId: questionData.ProductId } },
        User: { connect: { UserId: questionData.UserId } },
      },
    });

    res.json(newQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creando la pregunta" });
  }
};
