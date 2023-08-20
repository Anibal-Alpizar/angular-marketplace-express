import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentUser: any;

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      try {
        const currentUserData = JSON.parse(currentUserString);
        this.currentUser = currentUserData.user;
        const roles = this.currentUser.Roles;
        // console.log('User Roles:', roles);
      } catch (error) {
        console.error('Error parsing currentUser data:', error);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  isCustomer(): boolean {
    return this.currentUser?.Roles?.includes('Customer');
  }

  isVendorAdmin(): boolean {
    return (
      this.currentUser?.Roles?.includes('Vendor') ||
      this.currentUser?.Roles?.includes('Admin')
    );
  }
}
