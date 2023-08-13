import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/share/product.service';
import { NotificationService } from 'src/app/share/notification.service';
//  import {createOrder } from 'src/app/share/orders.service';
import { OrdersService } from 'src/app/share/orders.service';
import { HOME_ROUTE } from 'src/app/constants/routes.constants';
import { CloseScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  quantity: number = 1; // Inicializa la cantidad con 1
  data: any;
  isFormVisible = false;
  formCreate!: FormGroup;
  showNewQuestion: boolean = false;
  showNewAnswer: boolean = false;
  currentUser: any;
  newQuestion: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  answerText: { [questionId: number]: string } = {};
  newAnswer: { [questionId: number]: string } = {};

  questionFormVisibility: { [questionId: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private orderService: OrdersService
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.getProduct(Number(id));
    }
    this.createForm();
  }

  // Método para incrementar la cantidad
  incrementQuantity() {
    this.quantity++;
  }

  // Método para decrementar la cantidad
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onSubmit() {
    //IDUSUARIO✔
    //IDPRODUCT✔
    //Quantity✔
    //SubTotal✔
    //PaymentMethod😱
    //Andres✔
    //TaxAmount✔
    //Total✔

    const formData = new FormData();
    //const orderData = new OrderData();
    const currentUserString = localStorage.getItem('currentUser');
    const data = this.data[0].ProductId;
    const price = this.data[0].Price;

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const userId = currentUser?.user?.UserId;
      const addressId = currentUser?.user?.Address;
      console.log('Address', addressId);
      console.log('UserId', userId);

      if (userId) {
        formData.append('userId', userId);
        formData.append('addressId', addressId);
      } else {
        console.log('Invalid');
        this.notificationService.showError('Invalid');
      }
    } else {
      console.log('No se encontró el objeto currentUser en el localStorage.');
      this.notificationService.showError(
        'No se encontró el objeto currentUser en el localStorage.'
      );
    }

    formData.append('ProductId', this.formCreate.get('productId')?.value);
    console.log('ProductId', data);
    formData.append('Quantity', this.quantity.toString());
    console.log('Quantity', this.quantity.toString());
    formData.append('Subtotal', this.formCreate.get('subtotal')?.value);
    console.log('Subtotal', price);
    formData.append('PaymentMethodId', '1');
    console.log('PaymentMethodId', '1');
    formData.append('AddressId', '1');
    console.log('addressId', '1');

    this.orderService.createOrder(formData).subscribe(
      (response: any) => {
        console.log('Response', response);
        this.formCreate.reset();
        this.notificationService.showSuccess('Create Order Successful');
        this.router.navigate([HOME_ROUTE]);
      },
      (error: any) => {
        console.error('Error:', error);
        this.notificationService.showError('Error al crear el producto.');
      }
    );
  }

  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
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
