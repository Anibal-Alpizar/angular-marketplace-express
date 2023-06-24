import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { Product } from '../interfaces/product';

@Component({
  selector: 'app-product-by-user',
  templateUrl: './product-by-user.component.html',
  styleUrls: ['./product-by-user.component.css'],
})
export class ProductByUserComponent {
  data: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];
  userId: number | null = null;
  noProductsMessage: string = '';

  constructor(private gService: GenericService) {}
  ngAfterViewInit(): void {
    this.userProductsList();
  }
  userProductsList() {
    if (this.userId) {
      this.products = [];
      this.gService
        .get('/products', this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: Product[]) => {
            this.products = data;
          },
          (error: any) => {
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
