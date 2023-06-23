// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product-by-vendor',
//   templateUrl: './product-by-vendor.component.html',
//   styleUrls: ['./product-by-vendor.component.css']
// })
// export class ProductByVendorComponent {

// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-by-vendor',
  templateUrl: './product-by-vendor.component.html',
  styleUrls: ['./product-by-vendor.component.css'],
})
export class ProductByVendorComponent implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProductsByVendor();
  }

  getProductsByVendor(): void {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
