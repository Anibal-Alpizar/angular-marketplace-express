import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericService } from 'src/app/share/generic.service';
import { Product } from '../interfaces/product';
import { PRODUCTSBYUSERS_ROUTE } from 'src/app/constants/routes.constants';

@Component({
  selector: 'app-product-by-user',
  templateUrl: './product-by-user.component.html',
  styleUrls: ['./product-by-user.component.css'],
})
export class ProductByUserComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  filterProducts: Product[] = [];
  searchText: string = '';
  showElectronicsProductos: boolean = false;
  showHomeProducts: boolean = false;
  showSportsProducts: boolean = false;

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  constructor(private gService: GenericService) {}

  ngOnInit(): void {
    this.userProductsList();
  }

  userProductsList() {
    this.products = [];
    this.gService
      .get<Product[]>(PRODUCTSBYUSERS_ROUTE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Product[]) => {
          this.products = res;
          this.filterProductsByName();
          this.filterProducts = this.products;
        },
        (error: Error) => {
          console.error('Error: ', error);
        }
      );
  }

  showAllProducts() {
    this.showElectronicsProductos = false;
    this.filterProducts = this.filterProductsByName();
  }

  searchProduct() {
    this.filterProducts = this.filterProductsByN();
  }

  filterProductsByN(): Product[] {
    return this.products.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        ) || product.Price.toString().includes(this.searchText.toLowerCase())
    );
  }

  filterProductsByName(): any {
    this.filterProducts = this.products.filter((user) => {
      const nameMatches = user.ProductName.toLowerCase().includes(
        this.searchText.toLowerCase()
      );

      if (this.showElectronicsProductos) {
        return user.CategoryId === 1 && nameMatches;
      } else if (this.showHomeProducts) {
        return user.CategoryId === 2 && nameMatches;
      } else if (this.showSportsProducts) {
        return user.CategoryId === 3 && nameMatches;
      } else {
        return nameMatches;
      }
    });
  }

  focusSearchInput() {
    this.searchInput.nativeElement.focus();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
