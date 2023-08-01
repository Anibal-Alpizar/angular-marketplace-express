import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  urlAPI: string = environment.apiURL;
  constructor(private http: HttpClient) {}

  list(endpoing: string): Observable<any> {
    return this.http.get<any>(this.urlAPI + endpoing);
  }
  create(endPoint: string, objCreate: any | any): Observable<any | any> {
    return this.http.post<any>(this.urlAPI + endPoint, objCreate);
  }
}
