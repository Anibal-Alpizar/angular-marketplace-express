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

  columns: string[] = ['Vendedor', 'Producto', 'Cantidad', 'Precio'];

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

  searchOrder() {
    this.filterOrders = this.orders.filter((order) => {
      const matchesVendor = order.PurchaseItems.some((item) =>
        item.Product.User.FullName.toLowerCase().includes(
          this.searchText.toLowerCase()
        )
      );

      const matchesProduct = order.PurchaseItems.some((item) =>
        item.Product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        )
      );

      const matchesQuantity = order.PurchaseItems.some((item) =>
        item.Quantity.toString().includes(this.searchText)
      );

      const matchesPrice = order.PurchaseItems.some((item) =>
        item.Product.Price.toString().includes(this.searchText)
      );

      return matchesVendor || matchesProduct || matchesQuantity || matchesPrice;
    });
  }

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
