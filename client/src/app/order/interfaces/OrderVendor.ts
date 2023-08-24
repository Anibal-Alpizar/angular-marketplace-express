export interface Order {
  PurchaseId: number;
  UserId: number;
  ProductId: number;
  PaymentMethodId: number;
  AddressId: number;
  TotalAmount: number;
  TaxAmount: number;
  PurchaseDate: string;
  PurchaseStatus: string;
  Purchase: {
    PurchaseId: number;
    UserId: number;
    ProductId: number;
    PaymentMethodId: number;
    AddressId: number;
    Quantity: number;
    TotalAmount: number;
    TaxAmount: number;
    PurchaseDate: string;
    PurchaseStatus: string;
    Product: {
      ProductId: number;
      ProductName: string;
      Price: number;
      Description: string;
      User?: {
        UserId: number;
        FullName: string;
        Email: string;
        Addresses: {
          AddressId: number;
          Province: string;
          Canton: string;
          District: string;
          ExactAddress: string;
          PostalCode: string;
          Phone: string;
          UserId: number;
        }[];
      };
    };
    User?: {
      UserId: number;
      FullName: string;
      Email: string;
      Addresses: {
        AddressId: number;
        Province: string;
        Canton: string;
        District: string;
        ExactAddress: string;
        PostalCode: string;
        Phone: string;
        UserId: number;
      }[];
    };
  };
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


