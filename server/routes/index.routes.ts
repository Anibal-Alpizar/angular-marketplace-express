import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/ping", async (req: Request, res: Response) => {
  const result: { solution: number }[] =
    await prisma.$queryRaw`SELECT 1 + 1 AS solution`;
  const solution = result[0].solution;
  res.send(`Server response: ${solution}`);
});

export default router;
