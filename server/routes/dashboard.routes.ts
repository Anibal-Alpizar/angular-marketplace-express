import {
  getSalesPerDay,
  getTopProductsByMonth,
  calculateAverageRating,
  getTopRatedSellers,
  getWorstRatedSellers,
  getBestSellingProductsBySeller,
  getTopCustomerBySeller,
  getEvaluationCountsByRating,

} from "../controller/dashboard.controller";
import { Router } from "express";

const router = Router();

router.get("/sales-per-day", getSalesPerDay);

router.get("/top-products-by-month", getTopProductsByMonth);

router.get("/average-rating", calculateAverageRating);

router.get("/top-rated-sellers", getTopRatedSellers);

router.get("/worst-rated-sellers", getWorstRatedSellers);

router.get("/best-selling-products-by-seller/:id", getBestSellingProductsBySeller);

router.get("/top-customer-by-seller/:id", getTopCustomerBySeller);

router.get("/evaluation-counts-by-rating/:id", getEvaluationCountsByRating);

export default router;
