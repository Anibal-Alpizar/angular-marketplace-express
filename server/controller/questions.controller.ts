import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {request} from 'http';

const prisma = new PrismaClient();

//Funtion about to create a new Questions
export const createQuestions = async (req: Request, res: Response) => {
    let pregunta = req.body;
  
    try {
      const newQuestion = await prisma.question.create({
        data: {
          QuestionText: pregunta.QuestionText,
          Product: { connect: pregunta.Product, },
          User: { connect: pregunta.User, },
        },
      });
  
      if (newQuestion === null) {
        return res
          .status(404)
          .json({ message: "No products found for the specified user role" });
      }
  
      res.json(newQuestion);
  
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  };