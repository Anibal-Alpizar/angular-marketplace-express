export interface Product {
  ProductId: number;
  ProductName: string;
  Description: string;
  Price: number;
  Quantity: number;
  CategoryId: number;
  UserId: number;
  Status: string;
  Rating: number;
  Photos?: Photo[]; 
  Image: string[];
}

export interface Photo {
  PhotoId: number;
  ProductId: number;
  PhotoURL: string;
}
