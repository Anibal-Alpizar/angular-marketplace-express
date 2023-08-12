import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/share/locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  provinces: string[] = [];
  selectedProvince: string = '';
  cantons: any = {};
  selectedCanton: string = '';

  constructor(private lService: LocationService) {}

  ngOnInit(): void {
    this.loadProvinces();
  }

  onCantonSelected(event: any): void {
    this.selectedCanton = event.target.value;
  }

  loadProvinces(): void {
    this.lService
      .getProvinces()
      .then((data: any) => {
        this.provinces = Object.values(data);
      })
      .catch((error) => {
        console.error('Error loading provinces:', error);
        throw error;
      });
  }

  getCantonsForSelectedProvince(): string[] {
    if (this.selectedProvince) {
      return this.cantons[this.selectedProvince] || [];
    }
    return [];
  }

  loadCantons(provinceNumber: string): void {
    this.lService
      .getCantons(provinceNumber)
      .then((data: any) => {
        this.cantons[this.selectedProvince] = Object.values(data); 
        console.log(
          `Cantons loaded for province ${this.selectedProvince}:`,
          this.cantons[this.selectedProvince]
        );
      })
      .catch((error) => {
        console.error('Error loading cantons:', error);
        throw error;
      });
  }

  onProvinceSelected(event: any): void {
    const selectedProvinceName = event.target.value;
    this.selectedProvince = selectedProvinceName;

    this.lService
      .getProvinces()
      .then((data: any) => {
        const provinceNumber = Object.keys(data).find(
          (key) => data[key] === selectedProvinceName
        );
        if (provinceNumber) {
          console.log(`Selected Province Number: ${provinceNumber}`);

          this.loadCantons(provinceNumber); 
        } else {
          console.log('Province number not found.');
        }
      })
      .catch((error) => {
        console.error('Error loading provinces:', error);
        throw error;
      });
  }
}
