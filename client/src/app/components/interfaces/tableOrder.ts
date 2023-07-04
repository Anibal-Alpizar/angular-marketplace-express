import { Order } from "src/app/order/interfaces/Order";

export interface Column {
  name: string;
  key: keyof Order;
}
