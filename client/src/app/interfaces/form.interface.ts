import { FormControl } from '@angular/forms';
import { User } from './user.interface';

export interface FormControls {
  fullName: FormControl;
  identification: FormControl;
  password: FormControl;
  email: FormControl;
  phoneNumber: FormControl;
  address: FormControl;
  role: FormControl;
  proveedor: FormControl;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
