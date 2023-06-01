import { User } from "./users";

export interface PaymentMethod {
  PaymentMethodId: number;
  UserId: number;
  PaymentType: string;
  Provider: string;
  AccountNumber: string;
  ExpirationDate: Date;
}
