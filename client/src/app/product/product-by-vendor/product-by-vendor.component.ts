import { AfterViewInit, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { Product } from '../interfaces/product';
import { Column } from '../../components/interfaces/table';

@Component({
  selector: 'app-product-by-vendor',
  templateUrl: './product-by-vendor.component.html',
  styleUrls: ['./product-by-vendor.component.css'],
})
export class ProductByVendorComponent implements AfterViewInit {
  data: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  products: Product[] = [];

  columns: Column[] = [
    { name: 'Nombre del producto', key: 'ProductName' },
    { name: 'Descripción', key: 'Description' },
    { name: 'Precio', key: 'Price' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gService: GenericService
  ) {}

  ngAfterViewInit(): void {
    this.vendorProductsList();
  }

  vendorProductsList() {
    this.gService
      .list('/products')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Product[]) => {
        this.products = data;
      });
  }
  detail(id: number) {
    this.router.navigate(['/productsDetails', id], {
      relativeTo: this.route,
    });
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
