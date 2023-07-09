export interface Order {
  PurchaseId: number;
  UserId: number;
  PaymentMethodId: number;
  AddressId: number;
  TotalAmount: number;
  TaxAmount: number;
  PurchaseDate: string;
  PurchaseStatus: string;
  PurchaseItems: {
    PurchaseItemId: number;
    PurchaseId: number;
    ProductId: number;
    Quantity: number;
    Subtotal: number;
    PurchaseStatus: string;
    Product: {
      ProductId: number;
      ProductName: string;
      Description: string;
      Price: number;
      Quantity: number;
      CategoryId: number;
      UserId: number;
      Status: string;
      Rating: number;
      User: {
        UserId: number;
        FullName: string;
        Identification: string;
        PhoneNumber: string;
        Email: string;
        Password: string;
        IsActive: boolean;
        Address: string;
      };
    };
  }[];
}


