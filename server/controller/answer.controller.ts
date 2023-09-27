import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";

const prisma = new PrismaClient();

//Funtion about to create a new Answer
export const createAnswer = async (req: Request, res: Response) => {
  const { AnswerText, QuestionId, UserId } = req.body;

  
  try {
    const newAnswer = await prisma.answer.create({
      data: {
        AnswerText: AnswerText,
        Question: {
          connect: {
            QuestionId: QuestionId,
          },
        },
        User: {
          connect: {
          UserId: UserId,
          },
        },
      },
    });

    res.json(newAnswer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ups! Sucedio un error" });
  }
};
