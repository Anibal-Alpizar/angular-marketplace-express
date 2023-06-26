import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericService } from 'src/app/share/generic.service';
import { Product } from '../interfaces/product';

@Component({
  selector: 'app-product-by-user',
  templateUrl: './product-by-user.component.html',
  styleUrls: ['./product-by-user.component.css'],
})
export class ProductByUserComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  userId: number | null = null;
  noProductsMessage: string = '';

  constructor(private gService: GenericService) {}

  ngOnInit(): void {
    this.userProductsList();
  }

  userProductsList() {
    if (this.userId) {
      this.products = [];
      this.gService
        .get<Product[]>('/products', this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: Product[]) => {
            this.products = res;
          },
          (error: Error) => {
            console.error('Error: ', error);
          }
        );
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
