import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../order/interfaces/Order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  urlAPI: string = environment.apiURL;
  currentUser: any;

  constructor(private http: HttpClient) {}

  list(endPoint: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.urlAPI + endPoint);
  }

  getOrderDetails(OrderId: string): Observable<Order> {
    const endPoint = `purchaseItemDetailsByCustomer/${OrderId}`;
    const url = `${this.urlAPI}/${endPoint}`;
    return this.http.get<Order>(url);
  }
}
