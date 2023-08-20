import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
}
