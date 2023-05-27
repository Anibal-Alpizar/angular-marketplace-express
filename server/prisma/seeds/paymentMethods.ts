import { PaymentMethod } from "../types";

export const paymentMethods: PaymentMethod[] = [
  {
    PaymentMethodId: 1,
    PaymentType: "Tarjeta de crédito",
    Provider: "Visa",
    AccountNumber: "**** **** **** 1234",
    ExpirationDate: new Date("2023-12-31"),
  },
  {
    PaymentMethodId: 2,
    PaymentType: "PayPal",
    Provider: "PayPal Inc.",
    AccountNumber: "user@example.com",
    ExpirationDate: new Date("2023-10-31"),
  },
  {
    PaymentMethodId: 3,
    PaymentType: "Transferencia bancaria",
    Provider: "Banco ABC",
    AccountNumber: "1234567890",
    ExpirationDate: new Date("2023-12-31"),
  },
];
