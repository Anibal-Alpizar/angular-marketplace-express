import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/share/locations.service';
import { NotificationService } from '../share/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  provinces: string[] = [];
  districts: string[] = [];
  cantons: any = {};
  selectedCanton?: string;
  formCreate!: FormGroup;
  selectedDistrict?: string;
  selectedProvince?: string;
  exactAddress?: string;
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  curretnUserId = this.currentUser.user.UserId;
  postalCode?: string;
  makeSubmit: boolean = false;
  userAddresses: any[] = [];
  phone?: string;
  constructor(
    public fb: FormBuilder,
    private lService: LocationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
    this.reactiveForm();
    this.loadUserAddresses(this.curretnUserId);
  }

  reactiveForm() {
    this.formCreate = this.fb.group({
      province: ['', [Validators.required]],
      canton: ['', [Validators.required]],
      district: ['', [Validators.required]],
      exactAddress: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  createAddress(): void {
    this.makeSubmit = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const formData = {
      userId: currentUser.user.UserId,
      province: this.selectedProvince,
      canton: this.selectedCanton,
      district: this.selectedDistrict,
      exactAddress: this.exactAddress,
      postalCode: this.postalCode,
      phone: this.phone,
    };

    this.lService.createAddress(formData).then(
      (response) => {
        console.log('Dirección creada:', response);
        this.notificationService.showSuccess('Dirección creada');
        this.formCreate.reset();
        this.makeSubmit = false;
        this.selectedProvince = '';
        this.selectedCanton = '';
        this.selectedDistrict = '';
        this.exactAddress = '';
        this.postalCode = '';
        this.phone = '';
        window.location.reload();
      },
      (error) => {
        console.error('Error creando dirección:', error);
        this.notificationService.showError(
          'Error creando dirección, seleccione todos los campos'
        );
      }
    );
  }

  loadUserAddresses(userId: number): void {
    this.lService.getUserAddressesByUserId(userId).subscribe(
      (addresses) => {
        console.log(addresses);
        this.userAddresses = addresses;
        // this.notificationService.showSuccess('Direcciones cargadas');
      },
      (error) => {
        this.notificationService.showError('Error cargando direcciones');
      }
    );
  }

  onCantonSelected(event: any): void {
    const selectedCantonName = event.target.value;
    console.log(selectedCantonName)
    if (selectedCantonName) {
      const selectedCantonNumber = Object.keys(
        this.cantons[this.selectedProvince as string]
      ).find(
        (key) =>
          this.cantons[this.selectedProvince as string][key] ===
          selectedCantonName
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
        this.cantons[this.selectedProvince as string] = Object.values(data);
        console.log(
          `Cantons loaded for province ${this.selectedProvince}:`,
          this.cantons[this.selectedProvince as string]
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

  public errorHandling = (control: string, error: string) => {
    return (
      this.formCreate.controls[control].hasError(error) &&
      this.formCreate.controls[control].invalid &&
      (this.makeSubmit || this.formCreate.controls[control].touched)
    );
  };
}
