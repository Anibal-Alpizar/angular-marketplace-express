import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  GETPAYMENTMETHODSBYUSER_ROUTE,
  REGISTERPAYMENTMETHOD_ROUTE,
} from '../constants/routes.constants';
import { PaymentMethod } from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  registerPaymentMethod(userId: number, paymentMethodData: any) {
    const url = `${this.urlAPI}/users/${userId}/${REGISTERPAYMENTMETHOD_ROUTE}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post(url, paymentMethodData, { headers })
      .pipe(catchError(this.handleError));
  }

  getPaymentMethodsByUserId(userId: number): Observable<PaymentMethod[]> {
    const url = `${this.urlAPI}/users/${userId}/${GETPAYMENTMETHODSBYUSER_ROUTE}`;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<PaymentMethod[]>(url, { headers }).pipe(
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
