import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { categories } from "../prisma/seeds/categories";
import { users } from "../prisma/seeds/users";

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
  try {
    const users = await prisma.user.findMany({
      include: {
        Products: {
          include: {
            Photos: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found or the users do not have any products",
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
  let ProductIdId = parseInt(req.params.id); // ID del producto

  try {
    const product = await prisma.product.findMany({
      where: { ProductId: ProductIdId },
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
            Answers: true,
          },
        },
        Questions: {
          select: {
            QuestionText: true,
            User: {
              select: {
                FullName: true,
                Email: true,
              },
            },
            Answers: true,
          },
        },
        Photos: true,
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

//Funtion about to create a new product
export const createProduct = async (req: Request, res: Response) => {
  let products = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        ProductName: products.ProductName,
        Description: products.Description,
        Price: products.Price,
        Status: products.Status,
        Rating: products.Rating,
        Quantity: products.Quantity,
        Category: { connect: products.Category, },
        User: { connect: products.User, },
      },
    });

    if (newProduct === null) {
      return res
        .status(404)
        .json({ message: "No products found for the specified user role" });
    }

    res.json(newProduct);

  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  let product = req.body;
  let productId = parseInt(req.params.id);

  try {

    //This function is to bring an old product
    const oldProduct = await prisma.product.findUnique({
      where: {ProductId: productId},
      include: {
        Category: {select: {CategoryId: true}},
        User: {select: {UserId: true},}
      },
    });

    const newProduct = await prisma.product.update({
      where: {ProductId: productId},
      data: {
        ProductId: product.ProductId,
        ProductName: product.ProductName,
        Description: product.Description,
        Price: product.Price,
        Status: product.Status,
        Rating: product.Rating,
        Quantity: product.Quantity,
        Category: { 
                  connect: product.Category, },
        User: { connect: product.User, },
      },
    })





  } catch (error) {
    console.log(error);
    res.json(error);
  }

};

export const deleteProduct = (req: Request, res: Response) => {
  res.send(`Server response: delete product`);
};
