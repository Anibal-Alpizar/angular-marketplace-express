export interface Purchase {
  PurchaseId: number;
  UserId: number;
  PaymentMethodId: number;
  AddressId: number;
  TotalAmount: number;
  TaxAmount: number;
  PurchaseDate: string;
  PurchaseStatus: string;
}
