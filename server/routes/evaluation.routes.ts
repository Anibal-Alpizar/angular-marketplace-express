import { Router } from "express";
import { createEvaluation } from "../controller/evaluation.controller";

const router = Router();

router.post("/createEvaluation", createEvaluation);

export default router;
