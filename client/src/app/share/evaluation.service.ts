import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  sendEvaluation(
    userId: number,
    rating: number,
    comment: string,
    purchaseId: number
  ) {
    const url = `${this.urlAPI}/createEvaluation`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const evaluationData = {
      userId: userId,
      rating: rating,
      comment: comment,
      PurchaseId: purchaseId,
    };

    return this.http
      .post(url, evaluationData, { headers })
      .pipe(catchError(this.handleError));
  }
}
