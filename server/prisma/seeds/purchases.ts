import { Purchase } from "../types";

export const purchases: Purchase[] = [
  {
    PurchaseId: 1,
    UserId: 1,
    PaymentMethodId: 1,
    AddressId: 1,
    TotalAmount: 50.99,
    TaxAmount: 5.1,
    PurchaseDate: "2023-05-10T09:30:00Z",
    PurchaseStatus: "Completada",
  },
  {
    PurchaseId: 2,
    UserId: 2,
    PaymentMethodId: 1,
    AddressId: 2,
    TotalAmount: 120.5,
    TaxAmount: 12.05,
    PurchaseDate: "2023-05-12T15:45:00Z",
    PurchaseStatus: "En progreso",
  },
  {
    PurchaseId: 3,
    UserId: 3,
    PaymentMethodId: 2,
    AddressId: 3,
    TotalAmount: 75.0,
    TaxAmount: 7.5,
    PurchaseDate: "2023-05-15T11:20:00Z",
    PurchaseStatus: "Cancelada",
  },
];
