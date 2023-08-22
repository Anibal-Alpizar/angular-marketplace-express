import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/share/dashboard.service';
import { AuthenticationService } from 'src/app/share/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentUser: any;
  salesPerDay: any;
  totalSold: any[] = [];
  clente: any[] = [];
  evaluationCountsByRating: any[] = [];
  evaluationCountsByRatingChartData: any[] = [];
  evaluationCountsByRatingChartLabels: any[] = [];
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

  constructor(
    private dashboardService: DashboardService,
    authService: AuthenticationService
  ) {}

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
    });

    const userId = this.currentUser.UserId;

    this.dashboardService
      .getBestSellingProductsBySeller(userId)
      .subscribe((data: any) => {
        this.totalSold = data;
      });

    this.dashboardService
      .getTopcustomerbyseller(userId)
      .subscribe((data: any) => {
        this.clente = data;
      });

    this.dashboardService
      .getEvaluationCountsByRating(userId)
      .subscribe((data: any) => {
        this.evaluationCountsByRating = data;
        console.log(this.evaluationCountsByRating);
        this.evaluationCountsByRatingChartData = [
          {
            data: this.evaluationCountsByRating.map((item: any) => item.Count),
            backgroundColor: [
              'rgba(0, 255, 0, 0.6)', // Verde
              'rgba(0, 0, 255, 0.6)', // Azul
              'rgba(255, 255, 0, 0.6)', // Amarillo
              'rgba(255, 165, 0, 0.6)', // Naranja
              'rgba(255, 0, 0, 0.6)', // Rojo
            ],
            label: 'Cantidad de Estrellas',
          },
        ];
        console.log(this.evaluationCountsByRatingChartData);
        this.evaluationCountsByRatingChartLabels =
          this.evaluationCountsByRating.map((item: any) => item.Rating);
        console.log(this.evaluationCountsByRatingChartLabels);
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
