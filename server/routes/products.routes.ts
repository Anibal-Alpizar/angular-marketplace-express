import { Router, Request, Response } from "express";

const router = Router();

router.get("/products", (req: Request, res: Response) => {
  res.send(`Server response: products`);
});

export default router;
