import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';

const routes: Routes = [
  {
    path: 'product-by-vendor',
    component: ProductByVendorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
