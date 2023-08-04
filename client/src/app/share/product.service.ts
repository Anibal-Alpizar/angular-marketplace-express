import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Product } from '../product/interfaces/product';
import { environment } from 'src/environments/environment';
import {
  PRODUCTSDETAILS_ROUTE,
  CREATEQUESTION_ROUTE,
  CREATEANSWER_ROUTE,
} from '../constants/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  getProductDetails(productId: number): Observable<Product> {
    const endPoint = `${PRODUCTSDETAILS_ROUTE}/${productId}`;
    const url = `${this.urlAPI}/${endPoint}`;
    return this.http.get<Product>(url);
  }

  createQuestion(productId: number, questionText: string, userId: number) {
    const url = `${this.urlAPI}/${CREATEQUESTION_ROUTE}`;
    const headers = new HttpHeaders();
    const formData = new FormData();
    formData.append('QuestionText', questionText);
    formData.append('ProductId', productId.toString());
    formData.append('UserId', userId.toString());

    return this.http
      .post(url, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  createAnswer(questionId: number, answerText: string, userId: number) {
    const url = `${this.urlAPI}/${CREATEANSWER_ROUTE}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const answerData = {
      AnswerText: answerText,
      QuestionId: questionId,
      UserId: userId,
    };

    return this.http
      .post(url, answerData, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
