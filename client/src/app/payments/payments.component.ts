import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControls } from '../interfaces/form.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../share/payment.service';
import { NotificationService } from '../share/notification.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  savedPaymentMethods: string[] = [];
  selectedPaymentMethod: string | undefined;
  cardOwner: string | undefined;
  cardNumber: string | undefined;
  expirationMonth: string | undefined;
  expirationYear: string | undefined;
  cvc: string | undefined;
  showProveedorField = false;
  formCreate!: FormGroup;

  constructor(
    public fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      cardOwner: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    }) as FormGroup & FormControls;
  }

  onChangePaymentMethod(paymentMethod: string) {
    this.selectedPaymentMethod = paymentMethod;
  }

  onAddCard() {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.user && currentUser.user.UserId) {
        const userId = currentUser.user.UserId;

        const expirationMonth = this.formCreate.get('expirationMonth')?.value;
        const expirationYear = this.formCreate.get('expirationYear')?.value;
        const cvc = this.formCreate.get('cvc')?.value;

        const paymentData = {
          paymentType: this.selectedPaymentMethod,
          accountNumber: this.cardNumber,
          expirationMonth: expirationMonth,
          expirationYear: expirationYear,
          cvc: cvc,
        };

        this.paymentService
          .registerPaymentMethod(userId, paymentData)
          .subscribe(
            (response) => {
              console.log('Payment method registered:', response);
              this.notificationService.showSuccess(
                'Método de pago registrado correctamente'
              );

              const newPaymentMethod = `${this.selectedPaymentMethod} - ${expirationMonth}/${expirationYear}`;
              this.savedPaymentMethods.push(newPaymentMethod);

              this.formCreate.reset(); 
              this.selectedPaymentMethod = undefined;
              this.expirationMonth = undefined;
              this.expirationYear = undefined;
              this.cvc = undefined;

              this.cdr.detectChanges();
            },
            (error) => {
              console.error('Error registering payment method:', error);
              this.notificationService.showError(
                'Error al registrar el método de pago'
              );
            }
          );
      }
    }
  }
}
