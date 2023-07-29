
import {Request , Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {request} from 'http';

const prisma = new PrismaClient();

//Funtion about to create a new Answer
export const createAnswer = async (req: Request, res: Response) => {
    let answer = req.body;
  
    try {
      const newAnswer = await prisma.answer.create({
        data: { 
          AnswerText: answer.AnswerText,
          Question: { connect: answer.Question},
          User: { connect: answer.User },
        },
      });
  
      if (newAnswer === null) {
        return res
          .status(404)
          .json({ message: "No products found for the specified user role" });
      }
  
      res.json(newAnswer);
  
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  };
