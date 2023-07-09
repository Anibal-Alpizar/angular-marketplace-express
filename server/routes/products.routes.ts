import { Router } from "express";
import {
  getProductsByVendor,
  getProductByUser,
  detailsProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/products.controller";

const router = Router();

router.get("/productsByVendor", getProductsByVendor);

router.get("/productsByUsers", getProductByUser);

router.get("/productsDetails/:id", detailsProducts);

// router.post("/products", createProduct);

// router.put("/products/:id", updateProduct);

// router.delete("/products/:id", deleteProduct);

export default router;
