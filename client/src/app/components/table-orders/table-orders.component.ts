import { Component, Input } from '@angular/core';
import { Order } from 'src/app/order/interfaces/Order';
import { Column } from 'src/app/components/interfaces/tableOrder';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css'],
})
export class TableOrdersComponent {
  @Input() columns!: Column[];
  @Input() filterOrders: Order[] = [];
}
