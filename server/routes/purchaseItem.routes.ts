import { Router } from "express";
import {getPurchaseItems} from "../controller/purchaseItem.controller";

const router = Router();

router.get("/purchaseItem", getPurchaseItems);

export default router;