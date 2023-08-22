import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getSalesPerDay() {
    const url = `${this.urlAPI}/sales-per-day`;
    return this.http.get(url);
  }

  getTopProductsByMonth() {
    const url = `${this.urlAPI}/top-products-by-month`;
    return this.http.get(url);
  }

  getTopRatedSellers() {
    const url = `${this.urlAPI}/top-rated-sellers`;
    return this.http.get(url);
  }

  getWorstRatedSellers() {
    const url = `${this.urlAPI}/worst-rated-sellers`;
    return this.http.get(url);
  }

  getBestSellingProductsBySeller(userId:number): Observable<any>   {
    const url = `${this.urlAPI}/best-selling-products-by-seller/${userId}`;
    return this.http.get(url);
  }

  getTopcustomerbyseller(userId:number): Observable<any>   {
    const url = `${this.urlAPI}/top-customer-by-seller/${userId}`;
    return this.http.get(url);
  }

  getEvaluationCountsByRating(userId:number): Observable<any>   {
    const url = `${this.urlAPI}/evaluation-counts-by-rating/${userId}`;
    return this.http.get(url);
  }
}
