import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CREATEORDER_ROUTE } from '../constants/routes.constants';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  urlAPI: string = environment.apiURL;

  getProvinces(): Promise<string[]> {
    const url = 'https://ubicaciones.paginasweb.cr/provincias.json';
    return this.http
      .get<string[]>(url)
      .toPromise()
      .then((data) => data ?? []);
  }

  getCantons(province: string): Promise<any> {
    const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/cantones.json`;
    return this.http.get(url).toPromise();
  }

  getDistritos(province: string, canton: string): Promise<any> {
    const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/canton/${canton}/distritos.json`;
    return this.http.get(url).toPromise();
  }

  createAddress(formData: any): Promise<any> {
    const url = `${this.urlAPI}${CREATEORDER_ROUTE}`;
    return this.http.post(url, formData).toPromise();
  }

  getUserAddresses(userId: number): Promise<any[]> {
    const url = `${this.urlAPI}/locations/${userId}`;
    return this.http
      .get<any[]>(url)
      .toPromise()
      .then((response) => response || [])
      .catch((error) => {
        console.error('Error fetching user addresses:', error);
        return [];
      });
  }

  getUserAddressesByUserId(userId: number): Observable<any[]>{
    const url = `${this.urlAPI}/locations/${userId}`;
    return this.http.get<any[]>(url);
  }

  
}
