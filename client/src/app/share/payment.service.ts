import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REGISTERPAYMENTMETHOD_ROUTE } from '../constants/routes.constants';

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

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
