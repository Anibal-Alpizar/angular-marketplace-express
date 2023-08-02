import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "riosurporpista@gmail.com",
    pass: "vfotibpjmvldwars",
  },
});

function generateVerificationCode(): string {
  const length = 6;
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let verificationCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    verificationCode += characters.charAt(randomIndex);
  }

  return verificationCode;
}

function sendResponse(
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

export const register = async (req: Request, res: Response) => {
  const userData = req.body;

  // Validación de campos requeridos
  if (
    !userData.fullName ||
    !userData.identification ||
    !userData.phoneNumber ||
    !userData.email ||
    !userData.password ||
    !userData.address
  ) {
    return sendResponse(res, 400, false, "All fields are required.");
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return sendResponse(res, 400, false, "Invalid email address.");
  }

  // Genera un código de verificación (puedes usar una librería para esto)
  const verificationCode = generateVerificationCode();

  const token = jwt.sign(
    { email: userData.email },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "1d",
    }
  );

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userData.password, salt);

  const user = await prisma.user.create({
    data: {
      FullName: userData.fullName,
      Identification: userData.identification,
      PhoneNumber: userData.phoneNumber,
      Email: userData.email,
      Password: hash,
      IsActive: false,
      Address: userData.address,
      VerificationCode: verificationCode,
      VerificationToken: token,
    },
  });

  const roles = Array.isArray(userData.role) ? userData.role : [userData.role];

  for (const roleId of roles as number[]) {
    await prisma.userRole.create({
      data: {
        UserId: user.UserId,
        RoleId: roleId,
      },
    });
  }

  const selectedData = {
    FullName: userData.fullName,
    Identification: userData.identification,
    PhoneNumber: userData.phoneNumber,
    Email: userData.email,
    Address: userData.address,
  };

  const message = `
    <p>Gracias por registrarte en nuestro sitio. A continuación, te mostramos los datos que seleccionaste:</p>
    <ul>
      <li>Nombre completo: ${selectedData.FullName}</li>
      <li>Identificación: ${selectedData.Identification}</li>
      <li>Número de teléfono: ${selectedData.PhoneNumber}</li>
      <li>Email: ${selectedData.Email}</li>
      <li>Dirección: ${selectedData.Address}</li>
    </ul>
  `;

  // Envía el correo de confirmación al usuario
  const mailOptions = {
    from: "riosurporpista@gmail.com",
    to: userData.email,
    subject: "Confirm your email address",
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return sendResponse(
        res,
        500,
        false,
        "Error sending verification email: " + error.message
      );
    } else {
      return sendResponse(
        res,
        200,
        true,
        "Verification email sent. Please check your inbox and confirm your email address.",
        user
      );
    }
  });
};

export const login = async (req: Request, res: Response) => {
  const userData = req.body;

  const user = await prisma.user.findUnique({
    where: {
      Email: userData.email,
    },
    include: {
      Roles: {
        include: {
          Role: true,
        },
      },
    },
  });

  if (!user) {
    res.status(401).send({
      status: false,
      message: "The email doesn't exist",
    });
  } else {
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.Password
    );

    if (!isPasswordValid) {
      res.status(401).send({
        status: false,
        message: "Invalid password",
      });
      return;
    }

    const payload = {
      email: user.Email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const roleNames = user.Roles.map((userRole) => userRole.Role.RoleName);

    res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        user: {
          ...user,
          Roles: roleNames,
        },
        token,
      },
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
