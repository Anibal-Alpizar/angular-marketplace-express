import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductRoutingModule } from './product-routing.module';
import { TableComponent } from '../components/table/table.component';
import { TableInputComponent } from '../components/table-input/table-input.component';
import { ProductByUserComponent } from './product-by-user/product-by-user.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductByVendorComponent,
    ProductByUserComponent,
    TableComponent,
    TableInputComponent,
  ],
  imports: [CommonModule, ProductRoutingModule, FormsModule],
})
export class ProductModule {}
