import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { Product } from '../interfaces/product';
import { Column } from '../../components/interfaces/tableUser';
import { PRODUCTSBYVENDOR_ROUTE } from 'src/app/constants/routes.constants';

@Component({
  selector: 'app-product-by-vendor',
  templateUrl: './product-by-vendor.component.html',
  styleUrls: ['./product-by-vendor.component.css'],
})
export class ProductByVendorComponent implements AfterViewInit, OnDestroy {
  res: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  filterProducts: Product[] = [];
  errorText: string | null = null;
  searchText: string = '';

  @ViewChild('searchInput', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;

  columns: Column[] = [
    { name: 'Nombre del producto', key: 'ProductName' },
    { name: 'Descripción', key: 'Description' },
    { name: 'Precio', key: 'Price' },
    { name: 'Cantidad', key: 'Quantity' },
    { name: 'Usuario', key: 'UserId' },
  ];

  constructor(private gService: GenericService) {}

  ngAfterViewInit(): void {
    this.vendorProductsList();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  vendorProductsList() {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      const userId = user.user.UserId;
      this.gService
        .list(`${PRODUCTSBYVENDOR_ROUTE}/${userId}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: Product[]) => {
            this.products = res;
            this.filterProducts = res;
            this.focusSearchInput();
            this.errorText = null;
          },
          (error) => {
            console.error('Error al obtener los productos:', error);
            this.errorText =
              'Hubo un error al obtener los productos. Por favor, inténtelo nuevamente más tarde.';
          }
        );
    } else {
      console.error('No se encontró el usuario en el localStorage');
      this.errorText =
        'No se encontró el usuario en el localStorage. Por favor, inicie sesión nuevamente.';
    }
  }

  searchProduct() {
    this.filterProducts = this.products.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        ) ||
        product.Description.toLowerCase().includes(
          this.searchText.toLowerCase()
        ) ||
        product.Price.toString().includes(this.searchText.toLowerCase()) ||
        product.Quantity.toString().includes(this.searchText.toLowerCase()) ||
        product.UserId.toString().includes(this.searchText.toLowerCase())
    );
  }

  focusSearchInput() {
    setTimeout(() => {
      if (
        this.searchInput &&
        document.activeElement !== this.searchInput.nativeElement
      ) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }
}
