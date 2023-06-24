import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { ProductByVendorComponent } from './product/product-by-vendor/product-by-vendor.component';
import { ProductByUserComponent } from './product/product-by-user/product-by-user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
  { path: 'product-by-vendor', component: ProductByVendorComponent },
  { path: 'products/all', component: ProductByUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
