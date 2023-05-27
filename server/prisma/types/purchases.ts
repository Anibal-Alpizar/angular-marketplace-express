export type Purchase = {
  PurchaseId: number;
  CustomerId: number;
  AddressId: number;
  TotalAmount: number;
  TaxAmount: number;
  PaymentMethodId: number;
  PurchaseDate: string;
  PurchaseStatus: string;
};
