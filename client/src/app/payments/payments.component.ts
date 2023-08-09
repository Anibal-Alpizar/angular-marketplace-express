import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControls } from '../interfaces/form.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(public fb: FormBuilder, private cdr: ChangeDetectorRef) {
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
    console.log('Método de pago seleccionado:', this.selectedPaymentMethod);

    const expirationMonth = this.formCreate.get('expirationMonth')?.value;
    const expirationYear = this.formCreate.get('expirationYear')?.value;
    const cvc = this.formCreate.get('cvc')?.value;

    const newPaymentMethod = `${this.selectedPaymentMethod} - ${expirationMonth}/${expirationYear}`;
    this.savedPaymentMethods.push(newPaymentMethod);

    console.log('Selected Payment Method:', this.selectedPaymentMethod);
    console.log('Card Owner:', this.cardOwner);
    console.log('Card Number:', this.cardNumber);
    console.log('Expiration Month:', this.expirationMonth);
    console.log('Expiration Year:', this.expirationYear);
    console.log('CVC:', this.cvc);

    this.formCreate.reset();

    this.selectedPaymentMethod = undefined;
    this.expirationMonth = undefined;
    this.expirationYear = undefined;
    this.cvc = undefined;

    this.cdr.detectChanges();
  }
}
