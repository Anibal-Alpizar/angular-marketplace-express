import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PageNotFoundComponent],
  imports: [CommonModule, RouterModule, BrowserAnimationsModule, MatToolbarModule],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {}
