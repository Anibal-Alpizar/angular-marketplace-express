import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  ServerUrl = environment.apiURL;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private authenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private cartService: CartService) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  get isAuthenticated() {
    if (this.authenticated.value != null) {
      this.authenticated.next(true);
    } else {
      this.authenticated.next(false);
    }
    return this.authenticated.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.ServerUrl + '/register', user);
  }
}
