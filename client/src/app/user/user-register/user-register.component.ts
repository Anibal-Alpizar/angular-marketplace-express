import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  selectRole(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.formCreate.patchValue({
      role:
        selectedValue === '2,3' ? ROLE.CUSTOMER_VENDOR : Number(selectedValue),
    });
  }

  isCustomerSelected: boolean = true;
  isVendorSelected: boolean = false;
  hide = true;
  user: User | null = null;
  selectedRoleId: number | null = null;
  backendError: BackendError | null = null;
  roles: Role[] = [];
  formCreate!: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: UsersService,
    private authService: AuthenticationService,
    private cookieService: CookieService
  ) {
    this.reactiveForm();
    this.getRoles();
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      fullName: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      role: ['', [Validators.required]],
    }) as FormGroup & FormControls;
  }

  ngOnInit(): void {
    this.reactiveForm();
  }

  submitForm() {
    this.makeSubmit = true;
    if (this.formCreate.valid) {
      const selectedRole = this.formCreate.get('role')?.value;

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

      this.authService.register(this.formCreate.value).subscribe(
        (res: RegisterResponse) => {
          this.user = res;

          this.cookieService.set(
            'email',
            encodeURIComponent(this.formCreate.value.email)
          );

          this.router.navigate([LOGIN_ROUTE], {
            queryParams: {
              registered: 'true',
            },
          });
        },
        (error: HttpErrorResponse) => {
          this.backendError = error.error.message;
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
