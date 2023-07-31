import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductByUserComponent } from './product-by-user/product-by-user.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';

const routes: Routes = [
  {
    path: 'product-by-vendor',
    component: ProductByVendorComponent,
  },
  {
    path: 'products/all',
    component: ProductByUserComponent,
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'create',
    component: ProductCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
