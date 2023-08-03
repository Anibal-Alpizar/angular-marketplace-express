import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { UsersService } from 'src/app/share/users.service';
import { CookieService } from 'ngx-cookie-service';

interface Role {
  RoleId: number;
  RoleName: string;
}

interface User {
  id: number;
  username: string;
}

interface BackendError {
  message: string;
}

interface RegisterResponse extends User {
  userId: number;
  message: string;
  someOtherProperty: string;
  anotherProperty: boolean;
}

interface FormControls {
  fullName: FormControl;
  identification: FormControl;
  password: FormControl;
  email: FormControl;
  phoneNumber: FormControl;
  address: FormControl;
  role: FormControl;
}

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  selectRole(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.formCreate.patchValue({
      role: selectedValue === '2,3' ? [2, 3] : Number(selectedValue),
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
    this.getRoles();
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

          this.router.navigate(['/login'], {
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
      .list('/roles')
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
