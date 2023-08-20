import { Component, Input } from '@angular/core';
import { Order } from 'src/app/order/interfaces/Order';
import { Column } from 'src/app/components/interfaces/tableOrder';
import { OrdersService } from 'src/app/share/orders.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css'],
})
export class TableOrdersComponent {
  @Input() columns!: Column[];
  @Input() filterOrders: Order[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  data: any;
  totalPrice: number = 0;
  totalTaxes: number = 0;

  constructor(private gService: OrdersService) {}

  getProductNames(order: Order): string {
    const purchaseItems = order?.PurchaseItems || [];
    const productNames = purchaseItems.map((item) => item.Product?.ProductName);
    return productNames.join(' - ');
  }

  getProductQuantities(order: Order): string {
    const purchaseItems = order?.PurchaseItems || [];
    const quantities = purchaseItems.map((item) => item.Quantity);
    return quantities.join(' - ');
  }

  getOrder(id: any) {
    this.gService
      .getOrderDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;

        this.totalPrice = this.data.reduce(
          (sum: number, item: any) => sum + item.Product.Price * item.Quantity,
          0
        );
        this.totalTaxes = this.data.reduce(
          (sum: number, item: any) => sum + item.TaxAmount,
          0
        );
      });
  }
}
