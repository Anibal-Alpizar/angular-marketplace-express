import { Response } from "express";

export function sendResponse(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any
) {
  return res.status(status).json({
    status: success,
    message: message,
    data: data,
  });
}
