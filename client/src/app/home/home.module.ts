import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [HomeComponent, AboutComponent],
  imports: [CommonModule, HomeRoutingModule, MatSidenavModule, MatCardModule],
})
export class HomeModule {}
