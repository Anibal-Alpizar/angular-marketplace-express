import { Request, Response } from "express";

export const getProducts = (req: Request, res: Response) => {
  res.send(`Server response: products`);
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
