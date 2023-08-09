import { Router } from "express";
import { registerPaymentMethods } from "../controller/payment.controller";

const router = Router();

router.post("/users/:userId/payment-method", registerPaymentMethods);

export default router;
