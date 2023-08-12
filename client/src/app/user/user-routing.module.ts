import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserAboutComponent } from './user-about/user-about.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { PaymentsComponent } from '../payments/payments.component';
import { LocationsComponent } from '../locations/locations.component';

const routes: Routes = [
  { path: 'login', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'about', component: UserAboutComponent },
  { path: 'admin/user-list', component: UserListComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'locations', component: LocationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
