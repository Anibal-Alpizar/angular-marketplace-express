import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OrdersService } from 'src/app/share/orders.service';
import * as moment from 'moment';
import { PaymentMethod } from 'src/app/interfaces/payment.interface';
import { PaymentService } from 'src/app/share/payment.service';
import { NotificationService } from 'src/app/share/notification.service';
import { ORDERS_ROUTE } from 'src/app/constants/routes.constants';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements AfterViewInit, OnDestroy, OnInit {
  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalPrice: number = 0;
  totalTaxes: number = 0;
  savedPaymentMethods$: Observable<PaymentMethod[]> | undefined;
  savedPaymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | undefined;
  PurchaseId: any;
  isCanceled: boolean = false;

  formatDate(dateString: string): string {
    if (!dateString) {
      return 'No hay fecha registrada para esta orden';
    }

    const formattedDate = moment(dateString).format(
      'Do MMM YYYY [a las] hh:mm A'
    );
    return formattedDate;
  }

  constructor(
    private gService: OrdersService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.getOrder(Number(id));
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.user?.UserId;
    console.log('userId:', userId);
  }

  ngOnInit(): void {
    this.getPaymentMethodsForCurrentUser();
  }

  getPaymentMethodsForCurrentUser() {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.user && currentUser.user.UserId) {
        const userId = currentUser.user.UserId;
        this.savedPaymentMethods$ =
          this.paymentService.getPaymentMethodsByUserId(userId);

        this.paymentService.getPaymentMethodsByUserId(userId).subscribe(
          (response: PaymentMethod[]) => {
            this.savedPaymentMethods = response;
            console.log('savedPaymentMethods:', this.savedPaymentMethods);
          },
          (error) => {
            console.error('Error getting payment methods:', error);
          }
        );
      }
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

        if (this.data[0].PurchaseStatus === 'Completada') {
          this.isCanceled = true;
        } else {
          this.isCanceled = false;
        }

        this.totalPrice = this.data.reduce(
          (sum: number, item: any) => sum + item.Product.Price * item.Quantity,
          0
        );
        this.totalTaxes = this.data.reduce(
          (sum: number, item: any) => sum + item.TaxAmount,
          0
        );
        console.log(this.isCanceled)
        this.PurchaseId = this.data[0].PurchaseId;
      });
  }

  pagar() {
    console.log(this.PurchaseId);
    const orderId = this.PurchaseId;

    this.gService.markOrderAsCompleted(orderId).subscribe(
      (response) => {
       
        this.data.forEach((item: any) => {
          const productId = item.Product.ProductId;
          const newQuantity = item.Product.Quantity - item.Quantity;
          console.log('productId:', productId);
          console.log('newQuantity:', newQuantity);
          this.gService.updateProductQuantity(productId, newQuantity).subscribe(
            (updateResponse) => {
              console.log('Cantidad actualizada:', updateResponse);
            },
            (updateError) => {
              console.error('Error al actualizar la cantidad:', updateError);
            }
          );
        });

        this.notification.showSuccess('¡Orden pagada con éxito!');
        this.router.navigate([ORDERS_ROUTE]);
      },
      (error) => {
        this.notification.showError('¡Error al pagar la orden!');
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
