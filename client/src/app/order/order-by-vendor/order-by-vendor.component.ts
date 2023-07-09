import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Order } from '../interfaces/OrderVendor';
import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from 'src/app/share/orders.service';
import { Column } from 'src/app/components/interfaces/tableOrderVendor';

@Component({
  selector: 'app-order-by-vendor',
  templateUrl: './order-by-vendor.component.html',
  styleUrls: ['./order-by-vendor.component.css'],
})
export class OrderByVendorComponent implements AfterViewInit, OnDestroy {
  res: Order[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  orders: Order[] = [];
  filterOrders: Order[] = [];
  searchText: string = '';

  @ViewChild('searchInput', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;

  columns: Column[] = [
    // { name: 'Nombre del producto', key: 'ProductName' },
    { name: 'Cantidad', key: 'UserId' },
    // { name: 'Precio', key: 'Product.Price' },
  ];

  constructor(private gService: OrdersService) {}

  ngAfterViewInit(): void {
    this.vendorOrdersList();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  vendorOrdersList() {
    this.gService
      .list('/purchaseItemByVendor')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any[]) => {
        this.orders = res;
        this.filterOrders = res;
        this.focusSearchInput();
        console.log(this.orders);
      });
  }

  searchOrder() {}

  focusSearchInput() {
    setTimeout(() => {
      if (
        this.searchInput &&
        document.activeElement !== this.searchInput.nativeElement
      ) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }
}
