import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OrdersService } from 'src/app/share/orders.service';
import * as moment from 'moment';
import { PaymentMethod } from 'src/app/interfaces/payment.interface';
import { PaymentService } from 'src/app/share/payment.service';
import { NotificationService } from 'src/app/share/notification.service';
import { EVALUATIONS_ROUTE } from 'src/app/constants/routes.constants';
import { BillService } from 'src/app/share/bill.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('quantityElement', { static: false }) quantityElement:
    | ElementRef
    | undefined;

  data: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalPrice: number = 0;
  totalTaxes: number = 0;
  savedPaymentMethods$: Observable<PaymentMethod[]> | undefined;
  savedPaymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | undefined;
  PurchaseId: any;
  isCanceled: boolean = false;
  quantity: number = 1;
  items: any[] = [];
  selectedIndex: number | undefined;
  quantityOffset: string = '';

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
    private billService: BillService,
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

  checkQuantityAvailability() {
    if (this.quantity > this.data[0].Quantity) {
      console.log('tengo', this.quantity);
      console.log('en el array hay', this.data[0].Quantity);
      this.notification.showError('No hay suficiente cantidad disponible.');
      return false;
    }
    return true;
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
  // decreaseQuantity(index: number) {
  //   if (this.data[index].Quantity > 1) {
  //     this.data[index].Quantity--;
  //     this.updateTotalPrice();
  //   }
  //   console.log(`current quantity: ${this.quantity}`);
  // }

  decreaseQuantity(index: number) {
    if (this.data[index].Quantity > 1) {
      this.data[index].Quantity--;
      this.updateTotalPrice();
      this.selectedIndex = index; // Actualizar el índice seleccionado
      this.quantityOffset = `current quantity: ${this.getItemQuantityWithOffset(
        this.data[index],
        index
      )}`;
    }
  }

  // increaseQuantity(index: number) {
  //   this.data[index].Quantity++;
  //   this.updateTotalPrice();
  //   console.log(`current quantity: ${this.quantity}`);
  // }

  increaseQuantity(index: number) {
    this.data[index].Quantity++;
    this.updateTotalPrice();
    this.selectedIndex = index; // Actualizar el índice seleccionado
    this.quantityOffset = `current quantity: ${this.getItemQuantityWithOffset(
      this.data[index],
      index
    )}`;
  }

  getItemQuantityWithOffset(item: any, index: number): number {
    return item.Quantity + (index === this.selectedIndex ? this.quantity : 0);
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
        console.log(this.isCanceled);
        this.PurchaseId = this.data[0].PurchaseId;
        this.quantity = this.data[0].Quantity;
      });
  }

  pagar() {
    console.log('djkdskjsdjksdjkdjk', this.PurchaseId);
    const orderId = this.PurchaseId;
    const quantityValue = this.quantityElement?.nativeElement.textContent;
    console.log('no se cual es', this.data[0].Product.Quantity);

    console.log('quantityValue:', quantityValue);

    if (this.data[0].Product.Quantity < quantityValue) {
      this.notification.showError('No hay suficiente cantidad disponible.');
      return;
    }

    this.gService.markOrderAsCompleted(orderId).subscribe(
      (response) => {
        this.data.forEach((item: any) => {
          const productId = item.Product.ProductId;
          const productQuantity = item.Product.Quantity; // Asegúrate de que item.Product.Quantity sea correcto
          const purchasedQuantity = item.Quantity; // Asegúrate de que item.Quantity sea correcto

          // Verifica los valores antes de calcular newQuantity

          const newQuantity = productQuantity - purchasedQuantity;

          console.log('valor actualizadando', quantityValue);
          console.log('resta', newQuantity);

          console.log('product quantity:', productQuantity);
          console.log('purchased quantity:', purchasedQuantity);

          this.gService.updateOrderQuantity(orderId, quantityValue).subscribe(
            (updateResponse) => {
              console.log('Cantidad actualizada:', updateResponse);
            },
            (updateError) => {
              console.error('Error al actualizar la cantidad:', updateError);
            }
          );
          console.log(newQuantity, 'antes de que llegueeeee');
          this.gService.updateProductQuantity(productId, newQuantity).subscribe(
            (updateResponse) => {
              console.log('Cantidad actualizada:', updateResponse);
            },
            (updateError) => {
              console.error('Error al actualizar la cantidad:', updateError);
            }
          );
          console.log('anibal', quantityValue);
          console.log('charlie', newQuantity);
        });

        this.billService
          .getOrderDetailsForInvoice(orderId)
          .subscribe((response) => {});

        this.notification.showSuccess(
          '¡Orden pagada con éxito, a su correo llegará la factura!'
        );
        localStorage.setItem('purchaseId', orderId);

        this.router.navigate([EVALUATIONS_ROUTE]);
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
