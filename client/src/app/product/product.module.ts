import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductRoutingModule } from './product-routing.module';
import { TableComponent } from '../components/table/table.component';

@NgModule({
  declarations: [ProductByVendorComponent, TableComponent],
  imports: [CommonModule, ProductRoutingModule],
})
export class ProductModule {}
