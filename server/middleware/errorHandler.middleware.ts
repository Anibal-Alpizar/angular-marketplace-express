import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  return res.status(status).json({
    status: false,
    message: message,
  });
};
