import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductCreateService {
  urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  createProduct(formData: FormData): Observable<any> {
    console.log(formData); // Verifica si el formData contiene los datos esperados
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http
      .post(`${this.urlAPI}/createproducts`, formData, {
        headers: headers,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
