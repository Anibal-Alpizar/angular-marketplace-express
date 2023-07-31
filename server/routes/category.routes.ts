import { getCategories } from "../controller/category.controller";
import { Router } from "express";

const router = Router();

router.get("/getCategories", getCategories);

export default router;
