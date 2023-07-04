import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByUserComponent } from './order-by-user/order-by-user.component';
import { OrderRoutingModule } from './order-routing.module';

@NgModule({
  declarations: [OrderByUserComponent],
  imports: [CommonModule, OrderRoutingModule],
})
export class OrderModule {}
