import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  urlAPI: string = environment.apiURL;
  currentUser: any;

  constructor(private http: HttpClient) {}

  list(endPoint: string): Observable<any> {
    return this.http.get<any>(this.urlAPI + endPoint);
  }

  get(endPoint: string, filter: any): Observable<any | any[]> {
    return this.http.get<any | any[]>(this.urlAPI + endPoint + `/${filter}`);
  }
}
