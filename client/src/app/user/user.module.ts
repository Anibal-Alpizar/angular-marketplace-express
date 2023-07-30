import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRoutingModule } from './user-routing.module';
import { UserRegisterComponent } from './user-register/user-register.component';

@NgModule({
  declarations: [UserLoginComponent, UserRegisterComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
