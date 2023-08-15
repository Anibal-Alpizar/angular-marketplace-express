import { Router } from "express";
import {
  getPurchaseItemByUser,
  getPurchaseItemByVendor,
  detailsPurchaseItemByCustomer,
  detailsPurchaseItemsByPurchase
} from "../controller/purchaseItem.controller";

const router = Router();

router.get("/purchaseItem", getPurchaseItemByUser);

 router.get("/purchaseItemDetailsByCustomer/:id", detailsPurchaseItemByCustomer);
// router.get("/purchaseItemDetailsByPurchase/:purchaseId", detailsPurchaseItemByCustomer);
// router.get(
//   "/purchaseItems/by-purchase/:purchaseId",
//   detailsPurchaseItemsByPurchase
// );

router.get("/purchaseItemByVendor", getPurchaseItemByVendor);

export default router;
