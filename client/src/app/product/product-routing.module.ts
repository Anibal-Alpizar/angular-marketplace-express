import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { ProductByUserComponent } from './product-by-user/product-by-user.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

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
  {
    path: 'edit/:id',
    component: ProductEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
