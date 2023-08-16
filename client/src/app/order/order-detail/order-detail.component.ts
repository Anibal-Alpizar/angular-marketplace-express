import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from 'src/app/share/orders.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements AfterViewInit, OnDestroy {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalPrice: number = 0;
  totalTaxes: number = 0;

  formatDate(dateString: string): string {
    if (!dateString) {
      return 'No hay fecha registrada para esta orden';
    }

    const formattedDate = moment(dateString).format(
      'Do MMM YYYY [a las] hh:mm A'
    );
    return formattedDate;
  }

  constructor(private gService: OrdersService, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.getOrder(Number(id));
    }
  }

  decreaseQuantity(index: number) {
    if (this.data[index].Quantity > 1) {
      this.data[index].Quantity--;
      this.updateTotalPrice();
    }
  }

  increaseQuantity(index: number) {
    this.data[index].Quantity++;
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = this.data.reduce(
      (sum: number, item: any) => sum + item.Product.Price * item.Quantity,
      0
    );
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
