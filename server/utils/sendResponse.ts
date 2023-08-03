import { Response } from "express";

export const sendResponse = async (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: any,
  error?: Error | null
) => {
  if (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }

  return res.status(status).json({
    status: success,
    message: message,
    data: data,
  });
};
