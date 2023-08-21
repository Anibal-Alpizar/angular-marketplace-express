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
  topRatedSellers: any[] = [];
  topRatedSellersChartData: any[] = [];
  topRatedSellersChartLabels: any[] = [];
  topRatedSellersChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  worstRatedSellers: any[] = [];
  worstRatedSellersChartData: any[] = [];
  worstRatedSellersChartLabels: any[] = [];
  worstRatedSellersChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
    this.dashboardService.getTopRatedSellers().subscribe((data: any) => {
      this.topRatedSellers = data;
      this.topRatedSellersChartData = [
        {
          data: this.topRatedSellers.map((item: any) => item.AverageRating),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          label: 'Promedio de Calificación',
        },
      ];
      this.topRatedSellersChartLabels = this.topRatedSellers.map(
        (item: any) => item.FullName
      );
    });
    this.dashboardService.getWorstRatedSellers().subscribe((data: any) => {
      this.worstRatedSellers = data;
      this.worstRatedSellersChartData = [
        {
          data: this.worstRatedSellers.map((item: any) => item.AverageRating),
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
          label: 'Promedio de Calificación',
        },
      ];
      this.worstRatedSellersChartLabels = this.worstRatedSellers.map(
        (item: any) => item.FullName
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

  isVendor(): boolean {
    return this.currentUser?.Roles?.includes('Vendor');
  }

  isAdmin(): boolean {
    return this.currentUser?.Roles?.includes('Admin');
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
