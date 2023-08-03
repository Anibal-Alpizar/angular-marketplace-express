import { Request, Response } from "express";
import { login } from "../../controller/user.controller";
import { sendResponse } from "../../utils/sendResponse";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { prisma } from "../../controller/user.controller";

jest.mock("../../utils/sendResponse", () => ({
  sendResponse: jest.fn(),
}));

// Mock para prisma
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

describe("login", () => {
  it("should respond with 200 and a token for a valid login", async () => {
    const req: Partial<Request> = {
      body: {
        email: "existing@example.com",
        password: "correctpassword",
      },
    };
    const res: Partial<Response> = {};

    const userFindUniqueMock = jest.fn().mockResolvedValue({
      Email: "existing@example.com",
      Password: await bcrypt.hash("correctpassword", 10),
    });
    const prismaMock = prisma as jest.Mocked<PrismaClient>;
    prismaMock.user.findUnique = userFindUniqueMock;

    const bcryptCompareMock = jest.spyOn(bcrypt, "compare");
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await login(req as Request, res as Response);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          Email: "existing@example.com",
        },
        include: {
          Roles: {
            include: {
              Role: true,
            },
          },
        },
      })
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correctpassword",
      expect.any(String)
    );

    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Login successful",
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String),
      }),
      null
    );
  });
});
