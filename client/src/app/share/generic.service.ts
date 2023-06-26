import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../product/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  urlAPI: string = environment.apiURL;
  currentUser: any;

  constructor(private http: HttpClient) {}

  list(endPoint: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlAPI + endPoint);
  }

  get<T>(endPoint: string, userId: number): Observable<T> {
    return this.http.get<T>(`${this.urlAPI}${endPoint}/${userId}`);
  }
}
