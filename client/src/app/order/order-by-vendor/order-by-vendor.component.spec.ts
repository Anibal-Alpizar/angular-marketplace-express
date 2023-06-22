import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderByVendorComponent } from './order-by-vendor.component';

describe('OrderByVendorComponent', () => {
  let component: OrderByVendorComponent;
  let fixture: ComponentFixture<OrderByVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderByVendorComponent]
    });
    fixture = TestBed.createComponent(OrderByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
