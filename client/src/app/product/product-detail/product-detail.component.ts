import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { throwError } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/share/product.service';
import { NotificationService } from 'src/app/share/notification.service';
import { LocationService } from 'src/app/share/locations.service';
import { OrdersService } from 'src/app/share/orders.service';
import { HOME_ROUTE } from 'src/app/constants/routes.constants';
import { PaymentService } from 'src/app/share/payment.service';
import { PaymentMethod } from 'src/app/interfaces/payment.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  id: number = 1;
  quantity: number = 1;
  data: any;
  isFormVisible = false;
  formCreate!: FormGroup;
  showNewQuestion: boolean = false;
  showNewAnswer: boolean = false;
  currentUser: any;
  newQuestion: any;
  selectedAddressControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();
  answerText: { [questionId: number]: string } = {};
  newAnswer: { [questionId: number]: string } = {};
  userAddresses: any[] = [0];
  selectedAddressId: number | null = null;
  selectedAddress: number | null = null;
  savedPaymentMethods: PaymentMethod[] = [];
  savedPaymentMethods$: Observable<PaymentMethod[]> | undefined;

  questionFormVisibility: { [questionId: number]: boolean } = {};

  constructor(
    private lService: LocationService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private orderService: OrdersService,
    private paymentService: PaymentService
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.getProduct(Number(id));
    }
    this.createForm();
  }

  onAddressChange(): void {
    if (this.selectedAddress !== null) {
      console.log('Selected AddressId:', this.selectedAddress);
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
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
            console.log('Payment methods:', this.savedPaymentMethods);
          },
          (error) => {
            console.error('Error getting payment methods:', error);
          }
        );
      }
    }
  }

  onSubmit(id: number) {
    const currentUserString = localStorage.getItem('currentUser');

    if (!this.selectedAddressControl.value) {
      this.notificationService.showError(
        'No se seleccionó una dirección de envío, en caso de que no tenga direcciones, por favor cree una.'
      );
      this.router.navigate(['/locations']);
      return;
    }

    if (!this.savedPaymentMethods || this.savedPaymentMethods.length === 0) {
      this.notificationService.showError(
        'No se encontraron métodos de pago, por favor cree uno.'
      );
      this.router.navigate(['/payments']);
      return;
    }

    if (!currentUserString) {
      console.log('No se encontró el objeto currentUser en el localStorage.');
      this.notificationService.showError(
        'No se encontró el objeto currentUser en el localStorage.'
      );
      return;
    }

    const currentUser = JSON.parse(currentUserString);
    const userId = currentUser?.user?.UserId;
    console.log('userId:', userId);

    const product = this.data[0];
    if (!product) {
      console.log('No se encontró información del producto.');
      this.notificationService.showError(
        'No se encontró información del producto.'
      );
      return;
    }
    console.log(
      '????????????????????????????????????????????',
      this.selectedAddressId
    );
    console.log(this.selectedAddress);
    const orderData = {
      userId: userId,
      productId: product.ProductId,
      Quantity: this.quantity.toString(),
      subtotal: product.Price,
      PaymentMethodId: 1,
      AddressId: this.selectedAddress,
    };

    console.log('Quantity:', this.quantity.toString());
    console.log('PaymentMethodId:', orderData.PaymentMethodId);
    console.log('AddressId:', orderData.AddressId);

    this.orderService.createOrder(orderData).subscribe(
      (response: any) => {
        console.log('Response', response);
        this.formCreate.reset();
        this.notificationService.showSuccess('Orden creada exitosamente.');
        this.router.navigate([HOME_ROUTE]);
      },
      (error: any) => {
        console.error('Error:', error);
        this.notificationService.showError('Error al crear la orden.');
      }
    );
  }
  loadUserAddresses(userId: number): void {
    this.lService.getUserAddressesByUserId(userId).subscribe(
      (addresses) => {
        this.userAddresses = addresses;
        this.notificationService.showSuccess('Direcciones cargadas');
      },
      (error) => {
        this.notificationService.showError('Error cargando direcciones');
      }
    );
  }

  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    this.getPaymentMethodsForCurrentUser();

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
      this.currentUser = JSON.parse(currentUserString);
      this.loadUserAddresses(userId);
    }
  }

  toggleFormVisibility(questionId: number) {
    console.log('ID de la pregunta:', questionId);
    this.questionFormVisibility[questionId] =
      !this.questionFormVisibility[questionId];
  }

  submitAnswer(questionId: number) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const productId = this.route.snapshot.paramMap.get('id');
      const userId = currentUser.user.UserId;

      if (productId !== null) {
        this.productService
          .createAnswer(questionId, this.answerText[questionId], userId)
          .subscribe(
            (response: any) => {
              this.notificationService.showSuccess(
                'Respuesta enviada correctamente.'
              );
              console.log('Respuesta enviada con éxito:', response);
              this.newAnswer[questionId] = '';
              window.location.reload();
            },
            (error) => {
              this.notificationService.showError(
                'Error al enviar la respuesta.'
              );
              console.error('Error al enviar la respuesta:', error);
            }
          );
      } else {
        console.log(
          'El ID del producto es nulo. No se puede crear una respuesta.'
        );
      }
    }
  }

  createForm() {
    this.formCreate = this.formBuilder.group({
      comment: '',
    });
  }

  getProduct(id: any) {
    this.productService
      .getProductDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  }

  submitQuestion() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const productId = this.route.snapshot.paramMap.get('id');
      const userId = currentUser.user.UserId;

      if (productId !== null) {
        this.productService
          .createQuestion(
            Number(productId),
            this.formCreate.get('comment')?.value,
            userId
          )
          .subscribe(
            (response: any) => {
              this.notificationService.showSuccess(
                'Pregunta enviada correctamente.'
              );
              console.log('Pregunta enviada con éxito:', response);
              this.data[0].Questions.push(response);
              this.newQuestion = response;
              this.formCreate.get('comment')?.setValue('');
              this.showNewQuestion = true;

              setTimeout(() => {
                this.showNewQuestion = false;
              }, 5000000000000000000);
            },
            (error) => {
              this.notificationService.showError(
                'Error al enviar la pregunta.'
              );
              console.error('Error al enviar la pregunta:', error);
            }
          );
      } else {
        console.log(
          'El ID del producto es nulo. No se puede crear una pregunta.'
        );
      }
    }
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
