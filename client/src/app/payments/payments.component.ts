import { Component } from '@angular/core';
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

  constructor(public fb: FormBuilder) {}

  reactiveForm() {
    this.formCreate = this.fb.group({
      cardOwner: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    }) as FormGroup & FormControls;
  }

  onAddCard() {
    console.log('Método de pago seleccionado:', this.selectedPaymentMethod);

    // Obtén los valores de los campos del formulario
    const expirationMonth = this.formCreate.get('expirationMonth')?.value;
    const expirationYear = this.formCreate.get('expirationYear')?.value;
    const cvc = this.formCreate.get('cvc')?.value;

    // Verifica que todos los valores necesarios estén definidos antes de agregar el método de pago
    if (
      this.selectedPaymentMethod &&
      expirationMonth &&
      expirationYear &&
      cvc
    ) {
      // Agrega el método de pago a la lista de métodos guardados
      const newPaymentMethod = `${this.selectedPaymentMethod} - ${expirationMonth}/${expirationYear}`;
      this.savedPaymentMethods.push(newPaymentMethod);

      // Reinicia los campos del formulario
      this.formCreate.reset();

      // Limpia las propiedades relacionadas con el método de pago actual
      this.selectedPaymentMethod = undefined;
      this.expirationMonth = undefined;
      this.expirationYear = undefined;
      this.cvc = undefined;
    } else {
      console.log(
        'Por favor complete todos los campos requeridos antes de agregar un método de pago.'
      );
    }
  }

  onChangePaymentMethod(paymentMethod: string) {
    this.selectedPaymentMethod = paymentMethod;
  }
}
