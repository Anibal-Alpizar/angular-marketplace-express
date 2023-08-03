import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function generateToken(payload: any, expiresIn: string): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export const generateAuthToken = (email: string) => {
  const payload = {
    email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });
};
