export interface PaymentMethod {
  PaymentMethodId: number;
  UserId: number;
  PaymentType: string;
  AccountNumber: string;
  ExpirationMonth: string;
  ExpirationYear: string;
  Cvc: string;
}
