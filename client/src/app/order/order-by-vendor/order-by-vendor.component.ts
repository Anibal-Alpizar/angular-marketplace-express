import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { Order } from '../interfaces/Order';

import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from 'src/app/share/orders.service';
import { NotificationService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-order-by-vendor',
  templateUrl: './order-by-vendor.component.html',
  styleUrls: ['./order-by-vendor.component.css'],
})
export class OrderByVendorComponent implements AfterViewInit, OnDestroy {

  res: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  orders: any[] = [];
  filterOrders: any[] = [];
  @Input() orderFilter: Order[] = [];
  searchText: string = '';
  ProductId: any = '';
  selectedStatus: string | null = null;
  filteredOrders: Order[] = [];

  @ViewChild('searchInput', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;

  columns: string[] = ['Vendedor', 'Producto', 'Cantidad', 'Precio'];

  constructor(private gService: OrdersService, private notificationService: NotificationService, ) {
    this.applyFilter();
    this.filterOrders = this.filterOrders;
    this.orderFilter = this.orderFilter;
  }

  applyFilter() {
    if (this.selectedStatus) {
      this.filteredOrders = this.orderFilter.filter(
        (order) => order.PurchaseStatus === this.selectedStatus
      );
    } else {
      this.filteredOrders = this.orderFilter;
    }
  }
  ngAfterViewInit(): void {
    this.vendorOrdersList();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  vendorOrdersList() {
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
      .list(`/products-purchased-by-vendor/${userId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any[]) => {
        this.orders = res;
        this.filterOrders = this.orders
        this.focusSearchInput();
        console.log(this.orders);

      });
  }

  searchOrder() {
    this.filterOrders = this.orders.filter((order) => {
      const matchesVendor = order.PurchaseItems.some((item:any) =>
        item.Product.User.FullName.toLowerCase().includes(
          this.searchText.toLowerCase()
        )
      );

      const matchesProduct = order.PurchaseItems.some((item:any) =>
        item.Product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        )
      );

      const matchesQuantity = order.PurchaseItems.some((item:any) =>
        item.Quantity.toString().includes(this.searchText)
      );

      const matchesPrice = order.PurchaseItems.some((item:any) =>
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
