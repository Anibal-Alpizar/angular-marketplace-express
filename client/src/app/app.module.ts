import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ProductByVendorComponent } from './product/product-by-vendor/product-by-vendor.component';
import { ProductByUserComponent } from './product/product-by-user/product-by-user.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { OrderByUserComponent } from './order/order-by-user/order-by-user.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderByVendorComponent } from './order/order-by-vendor/order-by-vendor.component';

@NgModule({
  declarations: [AppComponent, ProductByVendorComponent, ProductByUserComponent, ProductDetailComponent, OrderByUserComponent, OrderDetailComponent, OrderByVendorComponent],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    HttpClientModule,

    // my modules
    CoreModule,
    ShareModule,
    HomeModule,

    BrowserAnimationsModule,

    // my routing
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
