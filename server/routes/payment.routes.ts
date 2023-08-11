import { Router } from "express";
import {
  getPaymentMethodsByUserId,
  registerPaymentMethod,
} from "../controller/payment.controller";

const router = Router();

router.post("/users/:userId/payment-method", registerPaymentMethod);

router.get("/users/:userId/payment-methods", getPaymentMethodsByUserId);

export default router;
