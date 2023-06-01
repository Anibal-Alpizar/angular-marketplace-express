export interface Purchase {
  PurchaseId: number;
  UserId: number;
  AddressId: number;
  TotalAmount: number;
  TaxAmount: number;
  PurchaseDate: string;
  PurchaseStatus: string;
}
