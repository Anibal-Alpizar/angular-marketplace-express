import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/share/authentication.service';
import { UsersService } from 'src/app/share/users.service';

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
  user: any;
  selectedRoleId: number | null = null;

  roles: any;
  formCreate!: FormGroup;
  makeSubmit: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private gService: UsersService,
    private authService: AuthenticationService
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
    });
    this.getRoles();
  }

  ngOnInit(): void {
    this.reactiveForm();
  }

  submitForm() {
    this.makeSubmit = true;
    if (this.formCreate.valid) {
      const selectedRole = this.formCreate.get('role')?.value;

      // Make sure to handle the role value based on its type (number or array)
      if (Array.isArray(selectedRole)) {
        // If it's an array, we have "Customer & Vendor" selected, so we can display it as a string
        const roleString = selectedRole
          .map((roleId) => this.getRoleName(roleId))
          .join(' & ');
        console.log('Form Data:', {
          ...this.formCreate.value,
          role: roleString,
        });
      } else {
        // For other roles, we can simply log the selected role ID
        console.log('Form Data:', this.formCreate.value);
      }

      // The rest of your form submission logic...
      // For example, if you want to submit the form using your API, you can do something like this:
      this.authService.register(this.formCreate.value).subscribe((res: any) => {
        this.user = res;
        this.router.navigate(['/login']);
        queryParams: {
          registered: 'true';
        }
      });
    }
  }

  getRoles() {
    this.gService
      .list('/roles')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.roles = data;
        console.log(this.roles);
      });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find((r: any) => r.RoleId === roleId);
    return role ? role.RoleName : '';
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };

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
