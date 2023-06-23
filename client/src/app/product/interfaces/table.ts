import { Product } from "./product";

export interface Column {
  name: string;
  key: keyof Product;
}
