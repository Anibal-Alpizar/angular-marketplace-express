import { Product } from "../types";

export const products: Product[] = [
  {
    ProductId: 1,
    ProductName: "Guitarra eléctrica",
    Description: "Una guitarra eléctrica de alta calidad",
    Price: 999.99,
    Quantity: 10,
    CategoryId: 1,
    Status: "Disponible",
  },
  {
    ProductId: 2,
    ProductName: "Laptop",
    Description: "Una laptop potente para tus necesidades informáticas",
    Price: 1499.99,
    Quantity: 5,
    CategoryId: 3,
    Status: "Disponible",
  },
  {
    ProductId: 3,
    ProductName: "Auriculares inalámbricos",
    Description:
      "Auriculares inalámbricos de alta calidad para disfrutar de tu música",
    Price: 199.99,
    Quantity: 20,
    CategoryId: 2,
    Status: "Disponible",
  },
];
