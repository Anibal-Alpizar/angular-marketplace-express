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
          this.filterProducts = this.filterProductsByName();
        },
        (error: Error) => {
          console.error('Error: ', error);
        }
      );
  }

  searchProduct() {
    this.filterProducts = this.filterProductsByName();
  }

  filterProductsByName(): Product[] {
    return this.products.filter(
      (product) =>
        product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        ) || product.Price.toString().includes(this.searchText.toLowerCase())
    );
  }

  focusSearchInput() {
    this.searchInput.nativeElement.focus();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
