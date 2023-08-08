import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserData {
  fullName: string;
  identification: string;
  phoneNumber: string;
  email: string;
  password: string;
  Proveedor: string | null;
  address: string;
  role?: number;
}

export interface ExtendedUserData extends UserData {
  verificationCode: string;
  verificationToken: string;
  isActive: boolean;
}

export async function createUser(userData: ExtendedUserData): Promise<User> {
  try {
    const newUser = await prisma.user.create({
      data: {
        FullName: userData.fullName,
        Identification: userData.identification,
        PhoneNumber: userData.phoneNumber,
        Email: userData.email,
        Password: userData.password,
        Proveedor: userData.Proveedor,
        IsActive: userData.isActive,
        Address: userData.address,
        VerificationCode: userData.verificationCode,
        VerificationToken: userData.verificationToken,
      },
    });

    return newUser;
  } catch (error: any) {
    throw new Error("Error creating user: " + error.message);
  }
}

export function generateVerificationCode(): string {
  const length = 6;
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let verificationCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    verificationCode += characters.charAt(randomIndex);
  }

  return verificationCode;
}
