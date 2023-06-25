import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductRoutingModule } from './product-routing.module';
import { TableComponent } from '../components/table/table.component';
import { CardComponent } from '../components/card/card.component';
import { ProductByUserComponent } from './product-by-user/product-by-user.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductByVendorComponent,
    ProductByUserComponent,
    TableComponent,
    CardComponent,
  ],

  imports: [CommonModule, ProductRoutingModule, FormsModule],
})
export class ProductModule {}
