import { Question } from './questions.interface';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  role: number;
  Questions: Question[];
}

export interface Role {
  RoleId: number;
  RoleName: string;
}

export interface RegisterResponse extends User {
  userId: number;
  message: string;
  someOtherProperty: string;
  anotherProperty: boolean;
}
