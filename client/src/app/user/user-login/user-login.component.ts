import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { NotificacionService, MessageType } from 'src/app/share/notification.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  hide = true;
  form!: FormGroup;
  makeSubmit: boolean = false;
  infoUser: any;

  constructor(
    public fb: FormBuilder,
    private authService: AuthenticationService,
    private notification: NotificacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.message();
  }

  message() {
    let register = false;
    let auth = '';
    this.route.queryParams.subscribe((params) => {
      register = params['register'] === 'true' || false;
      auth = params['auth'] || '';
      if (register) {
        this.notification.messageSuccess(
          'User',
          'Register successfully, please login!'
        );
      }
      if (auth) {
        this.notification.messageWarning(
          'User',
          'Please login to access this page!'
        );
      }
    });
  }

  onReset() {
    this.form.reset();
  }

  submitForm() {
    this.makeSubmit = true;
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value)

    this.authService.login(this.form.value).subscribe((res: any) => {
      this.router.navigate(['/home']);
    });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.form.controls[control].hasError(error) &&
      this.form.controls[control].invalid &&
      (this.makeSubmit || this.form.controls[control].touched)
    );
  };
}
