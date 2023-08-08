export interface User {
  UserId: number;
  FullName: string;
  Identification: string;
  PhoneNumber: string;
  Email: string;
  Password: string;
  IsActive: boolean;
  Address: string;
  Proveedor: string | null;
  VerificationCode: string;
  VerificationToken: String;
}
