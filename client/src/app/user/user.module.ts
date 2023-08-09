import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRoutingModule } from './user-routing.module';
import { UserRegisterComponent } from './user-register/user-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from './admin/user-list/user-list.component';
import { PaymentsComponent } from '../payments/payments.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    UserRegisterComponent,
    UserListComponent,
    PaymentsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, UserRoutingModule, FormsModule],
})
export class UserModule {}
