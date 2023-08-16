import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginForm, LoginResponse } from 'src/app/interfaces/form.interface';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { HOME_ROUTE } from 'src/app/constants/routes.constants';
import { NotificationService } from 'src/app/share/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  hide = true;
  form!: FormGroup;
  isFormSubmitted: boolean = false;
  backendError: string | null = null;

  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.form = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required] }],
    }) as FormGroup & { value: LoginForm };
  }

  ngOnInit(): void {
    this.mensajes();
    this.populateSavedEmail();
  }

  mensajes() {
    let register = false;
    let auth = '';
    this.route.queryParams.subscribe((params) => {
      register = params['register'] === 'true' || false;
      auth = params['auth'] || '';
      if (register) {
        this.notification.showSuccess(
          'Usuario registrado! Especifique sus credenciales',
          3000
        );
      }
      if (auth) {
        this.notification.showWarning(
          'Debe autenticarse para acceder a esta página',
          3000
        );
      }
    });
  }

  populateSavedEmail() {
    const savedEmail = this.cookieService.get('email');
    if (savedEmail) {
      this.form.get('email')?.setValue(decodeURIComponent(savedEmail));
    }
  }

  onReset() {
    this.form.reset();
    this.form.markAsUntouched();
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.login(this.form.value).subscribe(
      (res: LoginResponse) => {
        this.notification.showSuccess('¡Bienvenido/a!', 3000);
        this.router.navigate([HOME_ROUTE]);
      },
      (error: HttpErrorResponse) => {
        this.backendError = error.error.message;
        this.notification.showError('Login fallado!', 3000);
      }
    );
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.form.controls[control].hasError(error) &&
      this.form.controls[control].invalid &&
      (this.isFormSubmitted || this.form.controls[control].touched)
    );
  };
}
