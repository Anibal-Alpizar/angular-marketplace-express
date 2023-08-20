import { getSalesPerDay } from "../controller/dashboard.controller";
import { Router } from "express";

const router = Router();

router.get("/sales-per-day", getSalesPerDay);

export default router;
