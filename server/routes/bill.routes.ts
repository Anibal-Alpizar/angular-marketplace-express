import { Router } from "express";

import { getOrderDetailsForInvoice } from "../controller/bill.controller";

const router = Router();

router.get("/bill/:id", getOrderDetailsForInvoice);

export default router;

