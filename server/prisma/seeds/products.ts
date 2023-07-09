import { Product } from "../types";

export const products: Product[] = [
  {
    ProductId: 1,
    ProductName: "Guitarra eléctrica",
    Description: "Una guitarra eléctrica de alta calidad",
    Price: 999.99,
    Quantity: 10,
    CategoryId: 1,
    UserId: 2,
    Status: "Disponible",
    Rating: 4,
    ImgURL: "https://m.media-amazon.com/images/I/61eJqo1S-LS._AC_SX679_.jpg",
  },
  {
    ProductId: 2,
    ProductName: "Laptop",
    Description: "Una laptop potente para tus necesidades informáticas",
    Price: 1499.99,
    Quantity: 5,
    CategoryId: 3,
    UserId: 3,
    Status: "Disponible",
    Rating: 3,
    ImgURL: "https://m.media-amazon.com/images/I/414GQ37yPiL._AC_.jpg",
  },
  {
    ProductId: 3,
    ProductName: "Auriculares inalámbricos",
    Description:
      "Auriculares inalámbricos de alta calidad para disfrutar de tu música",
    Price: 199.99,
    Quantity: 20,
    CategoryId: 2,
    UserId: 3,
    Status: "Disponible",
    Rating: 1,
    ImgURL: "https://m.media-amazon.com/images/I/51VmaPtzeTL._AC_SX679_.jpg",
  },
  {
    ProductId: 4,
    ProductName: "Smartphone",
    Description: "Un smartphone de alta gama para tus necesidades",
    Price: 799.99,
    Quantity: 15,
    CategoryId: 3,
    UserId: 2,
    Status: "Disponible",
    Rating: 5,
    ImgURL: "https://m.media-amazon.com/images/I/6139eFMd4zL._AC_SX522_.jpg",
  },
];

