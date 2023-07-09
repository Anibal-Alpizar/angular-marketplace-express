import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderByVendorComponent } from './order-by-vendor/order-by-vendor.component';

const routes: Routes = [
  { path: 'orders', component: OrderByUserComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'orders-by-vendor', component: OrderByVendorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
