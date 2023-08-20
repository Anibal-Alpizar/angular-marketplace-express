import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '../../share/orders.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-by-completed-orders',
  templateUrl: './order-by-completed-orders.component.html',
  styleUrls: ['./order-by-completed-orders.component.css'],
})
export class OrderByCompletedOrdersComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  completedOrders: any[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getAllOrders() {
    this.ordersService
      .listCompletedOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any[]) => {
        this.completedOrders = res;
      });
  }

  calificarOrden(purchaseId: number) {
    localStorage.setItem('purchaseId', purchaseId.toString());
    window.location.href = '/createEvaluation';
  }
}
