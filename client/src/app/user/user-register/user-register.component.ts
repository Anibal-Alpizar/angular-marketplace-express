import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { UsersService } from 'src/app/share/users.service';
import { CookieService } from 'ngx-cookie-service';
import { FormControls } from 'src/app/interfaces/form.interface';
import { BackendError } from 'src/app/interfaces/backend.interface';
import { ROLE } from 'src/app/constants/role.constants';
import { LOGIN_ROUTE, ROLES_ROUTE } from 'src/app/constants/routes.constants';
import {
  Role,
  User,
  RegisterResponse,
} from 'src/app/interfaces/user.interface';
import { NotificationService } from 'src/app/share/notification.service';
import { LocationService } from 'src/app/share/locations.service';

function proveedorValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const selectedRole = control.parent?.get('role')?.value;

  if (selectedRole === 3) {
    return Validators.required(control);
  }

  if (selectedRole === 2) {
    return null;
  }

  return null;
}

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  isCustomerSelected: boolean = true;
  isVendorSelected: boolean = false;
  provinces: string[] = [];
  selectedPaymentMethod: string | undefined;
  cardOwner: string | undefined;
  cardNumber: string | undefined;
  expirationMonth: string | undefined;
  expirationYear: string | undefined;
  cvc: string | undefined;
  cantons: string[] = [];
  hide = true;
  user: User | null = null;
  showProveedorField = false;
  selectedRoleId: number | null = null;
  backendError: BackendError | null = null;
  savedPaymentMethods: string[] = [];

  roles: Role[] = [];
  formCreate!: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: UsersService,
    private lService: LocationService,
    private authService: AuthenticationService,
    private cookieService: CookieService,
    private notification: NotificationService
  ) {
    this.reactiveForm();
    this.getRoles();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      fullName: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      password: ['', [Validators.required]],
      proveedor: ['', proveedorValidator],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]],
      province: [''],
      cardOwner: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationMonth: ['', [Validators.required]],
      expirationYear: ['', [Validators.required]],
      cvc: ['', [Validators.required]],
    }) as FormGroup & FormControls;
  }

  ngOnInit(): void {
    this.reactiveForm();
    this.getProvinces();
  }

  selectRole(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.showProveedorField = selectedValue === '2,3' || selectedValue === '3';
    this.formCreate.patchValue({
      role:
        selectedValue === '2,3' ? ROLE.CUSTOMER_VENDOR : Number(selectedValue),
    });
  }

  onChangeProvince(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement)?.value;
    if (selectedValue !== null) {
      console.log('Provincia seleccionada:', selectedValue);
      this.getCantonsByProvince(selectedValue);
    }
  }

  getCantonsByProvince(province: string) {
    if (province) {
      this.lService.getCantons(province).then(
        (data: any) => {
          const cantons = Object.values(data);
          console.log('Cantones de la provincia:', cantons);
        },
        (error: any) => {
          console.error('Error fetching cantons:', error);
        }
      );
    }
  }

  getProvinces() {
    this.lService.getProvinces().then(
      (data: any) => {
        this.provinces = Object.values(data);
        this.formCreate.get('province')?.setValue(this.provinces[0] || '');
        console.log(this.provinces);
      },
      (error: any) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  getCantons(province: string) {
    this.lService.getCantons(province).then(
      (data: any) => {
        this.cantons = data;
      },
      (error: any) => {
        console.error('Error fetching cantons:', error);
      }
    );
  }

  onChangePaymentMethod(paymentMethod: string) {
    this.selectedPaymentMethod = paymentMethod;
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

  submitForm() {
    this.makeSubmit = true;
    if (this.formCreate.valid) {
      const selectedRole = this.formCreate.get('role')?.value;
      console.log('Form Data:', this.formCreate.value);

      if (Array.isArray(selectedRole)) {
        const roleString = selectedRole
          .map((roleId) => this.getRoleName(roleId))
          .join(' & ');
        console.log('Form Data:', {
          ...this.formCreate.value,
          role: roleString,
        });
      } else {
        console.log('Form Data:', this.formCreate.value);
      }

      const userData: any = {
        ...this.formCreate.value,
        Proveedor: this.formCreate.get('proveedor')?.value || null,
      };

      this.authService.register(userData).subscribe(
        (res: RegisterResponse) => {
          this.user = res;

          this.cookieService.set(
            'email',
            encodeURIComponent(this.formCreate.value.email)
          );

          this.notification.showSuccess(
            'Usuario registrado! Especifique sus credenciales',
            3000
          );
          this.router.navigate([LOGIN_ROUTE], {
            queryParams: {
              registered: 'true',
            },
          });
        },
        (error: HttpErrorResponse) => {
          this.backendError = error.error.message;
          this.notification.showError('Error al registrar usuario', 3000);
        }
      );
    }
  }

  getRoles() {
    this.gService
      .list(ROLES_ROUTE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Role[]) => {
        this.roles = data.filter((role: Role) => role.RoleId !== 1);
        console.log(this.roles);
      });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find((r: Role) => r.RoleId === roleId);
    return role ? role.RoleName : '';
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onReset() {
    this.formCreate.reset();
  }

  selectCustomer() {
    this.isCustomerSelected = true;
    this.isVendorSelected = false;
  }

  selectVendor() {
    this.isCustomerSelected = false;
    this.isVendorSelected = true;
  }
}
