import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import {
  NotificacionService,
  TipoMessage,
} from 'src/app/share/notification.service';

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
    private notification: NotificacionService,
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
    });
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
        this.notification.mensaje(
          'Usuario',
          'Usuario registrado! Especifique sus credenciales',
          TipoMessage.success
        );
      }
      if (auth) {
        this.notification.mensaje(
          'Usuario',
          'Debe autenticarse para acceder a esta página',
          TipoMessage.warning
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
  }

  submitForm() {
    this.isFormSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value).subscribe(
      (res: any) => {
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        this.backendError = error.error.message;
        this.notification.mensaje(
          'Error de autenticación',
          'Las credenciales proporcionadas son incorrectas',
          TipoMessage.error
        );
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
