import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  register(endpoint: string, objCreate: any | any): Observable<any | any[]> {
    return this.http.post<any | any[]>(
      environment.apiURL + endpoint,
      objCreate
    );
  }

  login(endpoint: string, objCreate: any | any): Observable<any | any[]> {
    return this.http.post<any | any[]>(
      environment.apiURL + endpoint,
      objCreate
    );
  }

  list(endpoint: string): Observable<any | any[]> {
    return this.http.get<any | any[]>(environment.apiURL + endpoint);
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.post<any>(environment.apiURL + '/update-user-status', {
      userId,
      isActive,
    });
  }
}
