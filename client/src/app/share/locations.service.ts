import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

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
    // example: https://ubicaciones.paginasweb.cr/provincia/1/canton/1/distritos.json
    const url = `https://ubicaciones.paginasweb.cr/provincia/${province}/canton/${canton}/distritos.json`;
    return this.http.get(url).toPromise();
  }
}