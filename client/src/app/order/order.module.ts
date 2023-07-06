import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderRoutingModule } from './order-routing.module';
import { TableOrdersComponent } from '../components/table-orders/table-orders.component';
import { FormsModule } from '@angular/forms';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  declarations: [OrderByUserComponent, TableOrdersComponent, OrderDetailComponent],
  imports: [CommonModule, OrderRoutingModule, FormsModule],
})
export class OrderModule {}
