import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/share/locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  provinces: string[] = [];
  districts: string[] = [];
  cantons: any = {};
  selectedCanton: string = '';
  selectedDistrict: string = '';
  selectedProvince: string = '';

  constructor(private lService: LocationService) {}

  ngOnInit(): void {
    this.loadProvinces();
  }

  onCantonSelected(event: any): void {
    const selectedCantonName = event.target.value;

    if (selectedCantonName) {
      const selectedCantonNumber = Object.keys(
        this.cantons[this.selectedProvince]
      ).find(
        (key) => this.cantons[this.selectedProvince][key] === selectedCantonName
      );

      if (selectedCantonNumber) {
        console.log(`Selected Canton Number: ${selectedCantonNumber}`);
        const provinceToDistrictMapping = {
          'San José': '1',
          Alajuela: '2',
          Cartago: '3',
          Heredia: '4',
          Guanacaste: '5',
          Puntarenas: '6',
          Limón: '7',
        };

        const provinceNumber =
          provinceToDistrictMapping[
            this.selectedProvince as keyof typeof provinceToDistrictMapping
          ];
        this.loadDistricts(provinceNumber, selectedCantonNumber);
      } else {
        console.log('Canton number not found.');
      }
    }
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

  loadDistricts(provinceNumber: string, cantonNumber: string): void {
    this.lService
      .getDistritos(provinceNumber, cantonNumber)
      .then((data: any) => {
        this.districts = Object.values(data);
        console.log(
          `Districts loaded for province ${provinceNumber}, canton ${cantonNumber}:`,
          this.districts
        );
      })
      .catch((error) => {
        console.error('Error loading districts:', error);
        throw error;
      });
  }

  onDistrictSelected(event: any): void {
    this.selectedDistrict = event.target.value;
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
