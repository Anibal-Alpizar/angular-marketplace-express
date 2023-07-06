import { PurchaseItem } from "../types";

export const purchaseItems: PurchaseItem[] = [
  {
    PurchaseItemId: 1,
    PurchaseId: 3,
    ProductId: 1,
    Quantity: 2,
    Subtotal: 19.98,
    PurchaseStatus: "Cancelada"
  },
  {
    PurchaseItemId: 2,
    PurchaseId: 1,
    ProductId: 3,
    Quantity: 1,
    Subtotal: 30.01,
    PurchaseStatus: "Completada"
  },
  {
    PurchaseItemId: 3,
    PurchaseId: 2,
    ProductId: 2,
    Quantity: 2,
    Subtotal: 85.0,
    PurchaseStatus: "En progreso"
  },
];
