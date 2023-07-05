import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Order } from '../interfaces/Order';
import { Column } from 'src/app/components/interfaces/tableOrder';
import { OrdersService } from 'src/app/share/orders.service';

@Component({
  selector: 'app-order-by-user',
  templateUrl: './order-by-user.component.html',
  styleUrls: ['./order-by-user.component.css'],
})
export class OrderByUserComponent implements AfterViewInit, OnDestroy {
  res: Order[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  orders: Order[] = [];

  columns: Column[] = [
    { name: 'Comprador', key: 'UserId' },
    { name: 'Producto', key: 'ProductId' },
    { name: 'Cantidad', key: 'Quantity' },
    { name: 'Estado', key: 'PurchaseStatus' },
  ];

  constructor(private gService: OrdersService) {}

  ngAfterViewInit(): void {
    this.orderProductsList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  orderProductsList() {
    this.gService
      .list('/purchaseitem')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Order[]) => {
        this.orders = res;
        console.log(this.orders);
      });
  }
}
