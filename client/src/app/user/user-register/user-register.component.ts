import { Component } from '@angular/core';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent {
  isCustomerSelected: boolean = true;
  isVendorSelected: boolean = false;

  selectCustomer() {
    this.isCustomerSelected = true;
    this.isVendorSelected = false;
  }

  selectVendor() {
    this.isCustomerSelected = false;
    this.isVendorSelected = true;
  }
}
