import { Product } from "../../product/interfaces/product";

export interface Column {
  name: string;
  key: keyof Product;
}
