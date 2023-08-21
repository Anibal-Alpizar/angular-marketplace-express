import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/share/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentUser: any;
  salesPerDay: any;
  topProductsByMonth: any[] = [];
  topProductsByMonthChartData: any[] = [];
  topProductsByMonthChartLabels: any[] = [];
  topProductsByMonthChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

    this.dashboardService.getTopProductsByMonth().subscribe((data: any) => {
      this.topProductsByMonth = data;
      this.topProductsByMonthChartData = [
        {
          data: this.topProductsByMonth.map((item: any) => item.TotalQuantity),
          backgroundColor: 'rgba(54, 162, 235, 0.6)', 
          label: 'Cantidad',
        },
      ];
      this.topProductsByMonthChartLabels = this.topProductsByMonth.map(
        (item: any) => item.ProductName
      );
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
