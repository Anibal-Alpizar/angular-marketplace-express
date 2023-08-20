import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderRoutingModule } from './order-routing.module';
import { TableOrdersComponent } from '../components/table-orders/table-orders.component';
import { FormsModule } from '@angular/forms';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderByVendorComponent } from './order-by-vendor/order-by-vendor.component';
import { OrderByCompletedOrdersComponent } from './order-by-completed-orders/order-by-completed-orders.component';

@NgModule({
  declarations: [
    OrderByUserComponent,
    TableOrdersComponent,
    OrderDetailComponent,
    OrderByVendorComponent,
    OrderByCompletedOrdersComponent,
  ],
  imports: [CommonModule, OrderRoutingModule, FormsModule],
})
export class OrderModule {}
