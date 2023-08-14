import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Order } from '../interfaces/Order';
import { Column } from 'src/app/components/interfaces/tableOrder';
import { OrdersService } from 'src/app/share/orders.service';
import { NotificationService } from 'src/app/share/notification.service';

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

  constructor(private gService: OrdersService, private notificationService: NotificationService,) {}

  ngAfterViewInit(): void {
    this.orderProductsList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  orderProductsList() {
    const currentUserString = localStorage.getItem('currentUser');
    
    if (!currentUserString) {
      console.log('No se encontró el objeto currentUser en el localStorage.');
      this.notificationService.showError(
        'No se encontró el objeto currentUser en el localStorage.'
      );
      return;
    }
   
    const currentUser = JSON.parse(currentUserString);
    const userId = currentUser?.user?.UserId;
    if (currentUserString) {
     
     
    }
    this.gService
      .list(`/orderByCustumer/${userId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Order[]) => {
        this.orders = res;
        console.log(this.orders);
      });
  }
}
