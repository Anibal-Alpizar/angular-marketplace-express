import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/share/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentUser: any;
  salesPerDay: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      try {
        const currentUserData = JSON.parse(currentUserString);
        this.currentUser = currentUserData.user;
        const roles = this.currentUser.Roles;
      } catch (error) {
        console.error('Error parsing currentUser data:', error);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }

    this.dashboardService.getSalesPerDay().subscribe((data: any) => {
      this.salesPerDay = data;
      console.log('salesPerDay', this.salesPerDay);
    });
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

  getCurrentDate(): Date {
    return new Date();
  }
}
