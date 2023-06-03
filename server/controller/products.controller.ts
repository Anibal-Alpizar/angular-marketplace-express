import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = (req: Request, res: Response) => {
  const products = prisma.product
    .findMany({
      select: {
        ProductId: true,
        ProductName: true,
        Description: true,
        Price: true,
        Quantity: true,
        CategoryId: true,
        Status: true,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.json(error);
    });

  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
};

export const getProduct = (req: Request, res: Response) => {
  res.send(`Server response: product`);
};

export const createProduct = (req: Request, res: Response) => {
  res.send(`Server response: create product`);
};

export const updateProduct = (req: Request, res: Response) => {
  res.send(`Server response: update product`);
};

export const deleteProduct = (req: Request, res: Response) => {
  res.send(`Server response: delete product`);
};
