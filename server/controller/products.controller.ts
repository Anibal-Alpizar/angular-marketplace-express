import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { categories } from "../prisma/seeds/categories";

const prisma = new PrismaClient();

//Funtion about get all products to only vendor
export const getProductsByVendor = async (req: Request, res: Response) => {
  let roleId = 3; // ID del Role específico para el vendedor

  try {
    const users = await prisma.user.findMany({
      where: {
        Roles: {
          some: {
            RoleId: roleId,
          },
        },
      },
      include: {
        Products: true,
      },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    const products = users.flatMap((user) => user.Products);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//Funtion about get all products to anything user
export const getProductByUser = async (req: Request, res: Response) => {
  let roleId = parseInt(req.params.id); // ID de cualquier Rol

  try {
    const users = await prisma.user.findMany({
      where: {
        Roles: {
          some: {
            RoleId: roleId,
          },
        },
      },
      include: {
        Products: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message:
          "No users found for the specified role or the users do not have any products",
      });
    }

    const products = users.flatMap((user) => user.Products);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

//Funtion about details to products
export const detailsProducts = async (req: Request, res: Response) => {
//  let ProductIdId = parseInt(req.params.id); // ID del producto

  try {
    const product = await prisma.product.findMany({
     // where: { ProductId: ProductIdId },
      include: {
        Category: true,
        User: {
          select: {
            UserId: true,
            FullName: true,
            Identification: true,
            PhoneNumber: true,
            Email: true,
            Password: true,
            IsActive: true,
            Address: true,
            Questions: true,
            Answers: true
          },
        },
        
      },
    });

    if (product.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
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
