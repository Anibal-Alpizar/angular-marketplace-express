import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';

const routes: Routes = [
  { path: 'orders', component: OrderByUserComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
