import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductByVendorComponent } from './product-by-vendor.component';

describe('ProductByVendorComponent', () => {
  let component: ProductByVendorComponent;
  let fixture: ComponentFixture<ProductByVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductByVendorComponent]
    });
    fixture = TestBed.createComponent(ProductByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
