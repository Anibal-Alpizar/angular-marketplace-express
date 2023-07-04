export interface Order {
  UserId: number;
  ProductId: number;
  Quantity: number;
  PurchaseStatus: string;
  Product: {
    ProductId: number;
    ProductName: string;
    Price: number;
    Description: string;
    User: {
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
}
