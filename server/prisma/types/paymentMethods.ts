export interface PaymentMethod {
  PaymentMethodId: number;
  PaymentType: string;
  Provider: string;
  AccountNumber: string;
  ExpirationDate: Date;
}
