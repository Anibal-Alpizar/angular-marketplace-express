import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getOrderDetailsForInvoice(orderId: string) {
    const endPoint = `bill/${orderId}`;
    const url = `${this.urlAPI}/${endPoint}`;
    return this.http.get<any>(url);
  }
}
