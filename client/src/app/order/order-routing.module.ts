import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

const routes: Routes = [
  { path: 'orders', component: OrderByUserComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
