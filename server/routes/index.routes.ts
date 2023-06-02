const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");

const router = Router();
const prisma = new PrismaClient();

router.get("/ping", async (req: any, res: any) => {
  const [{ solution }] = await prisma.$queryRaw`SELECT 1 + 1 AS solution`;
  res.send(`Server response: ${solution}`);
});

module.exports = router;
