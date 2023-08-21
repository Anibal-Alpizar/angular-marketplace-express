import { getSalesPerDay, getTopProductsByMonth } from "../controller/dashboard.controller";
import { Router } from "express";

const router = Router();

router.get("/sales-per-day", getSalesPerDay);

router.get("/top-products-by-month", getTopProductsByMonth);

export default router;
