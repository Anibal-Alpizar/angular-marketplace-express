import { Router } from "express";
import { registerPaymentMethod } from "../controller/payment.controller";

const router = Router();

router.post("/users/:userId/payment-method", registerPaymentMethod);

export default router;
