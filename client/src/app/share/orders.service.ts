import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../order/interfaces/Order';
import { catchError } from 'rxjs/operators';
import { CREATEORDER_ROUTE, HOME_ROUTE } from '../constants/routes.constants';

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
    const endPoint = `details/${OrderId}`;
    const url = `${this.urlAPI}/${endPoint}`;
    return this.http.get<Order>(url);
  }

  createOrder(orderData: any): Observable<any> {
    const endPoint = 'create-order';
    const url = `${this.urlAPI}/${endPoint}`;
    return this.http.post<any>(url, orderData);
  }

  markOrderAsCompleted(orderId: string): Observable<any> {
    const endPoint = `mark-order-completed/${orderId}`;
    const url = `${this.urlAPI}/${endPoint}`;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch(url, null, { headers }).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
