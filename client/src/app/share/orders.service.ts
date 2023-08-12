import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Order } from '../order/interfaces/Order';
import { catchError } from 'rxjs/operators';
import { CREATEORDER_ROUTE } from '../constants/routes.constants';


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

  
  createOrder(formData: FormData): Observable<any> {
    console.log(formData);
    const headers = new HttpHeaders();
    headers.append('Content-Type','multipart/form-data');

    return this.http.post(this.urlAPI + CREATEORDER_ROUTE, formData, {
      headers: headers,
    })
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
