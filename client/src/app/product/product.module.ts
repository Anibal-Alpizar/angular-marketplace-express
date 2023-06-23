import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductRoutingModule } from './product-routing.module';


@NgModule({
  declarations: [ProductByVendorComponent],
  imports: [CommonModule, ProductRoutingModule],
})
export class ProductModule {}
