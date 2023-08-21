import {
  getSalesPerDay,
  getTopProductsByMonth,
  calculateAverageRating,
  getTopRatedSellers,
  getWorstRatedSellers
} from "../controller/dashboard.controller";
import { Router } from "express";

const router = Router();

router.get("/sales-per-day", getSalesPerDay);

router.get("/top-products-by-month", getTopProductsByMonth);

router.get("/average-rating", calculateAverageRating);

router.get("/top-rated-sellers", getTopRatedSellers);

router.get("/worst-rated-sellers", getWorstRatedSellers);

export default router;
