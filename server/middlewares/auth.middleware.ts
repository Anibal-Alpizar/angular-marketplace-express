import { Request, Response, NextFunction } from "express";

export function validateLoginData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  next();
}
