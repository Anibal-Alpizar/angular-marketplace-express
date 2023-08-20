import { Router } from "express";
import {
  createOrder,
  getPurchaseByCustumer,
  details,
  markOrderAsCompleted,
  updateProductQuantityByPurchaseId,
  getCompletedPurchases,
} from "../controller/order.controller";

const router = Router();
router.get("/orderByCustumer/:id", getPurchaseByCustumer);

router.get("/details/:id", details);

router.get("/completed-orders", getCompletedPurchases);

router.post("/create-order", createOrder);

router.patch("/mark-order-completed/:id", markOrderAsCompleted);

router.patch("/change-product-quantity/:id", updateProductQuantityByPurchaseId);

export default router;
