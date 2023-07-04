import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderRoutingModule } from './order-routing.module';
import { TableOrdersComponent } from '../components/table-orders/table-orders.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderByUserComponent, TableOrdersComponent],
  imports: [CommonModule, OrderRoutingModule, FormsModule],
})
export class OrderModule {}
