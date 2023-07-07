export interface Order {
  UserId: number;
  PurchaseItemId: number;
  ProductId: number;
  Quantity: number;
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
  Purchase: {
    PurchaseId: number;
    UserId: number;
    PaymentMethodId: number;
    AddressId: number;
    TotalAmount: number;
    TaxAmount: number;
    PurchaseDate: string;
    PurchaseStatus: string;
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
  PurchaseItems?: {
    PurchaseItemId: number;
    PurchaseId: number;
    ProductId: number;
    Quantity: number;
    Subtotal: number;
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
    Purchase: {
      PurchaseId: number;
      UserId: number;
      PaymentMethodId: number;
      AddressId: number;
      TotalAmount: number;
      TaxAmount: number;
      PurchaseDate: string;
      PurchaseStatus: string;
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
  }[];
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
}