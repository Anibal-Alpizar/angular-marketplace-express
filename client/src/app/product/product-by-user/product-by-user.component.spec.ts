import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductByUserComponent } from './product-by-user.component';

describe('ProductByUserComponent', () => {
  let component: ProductByUserComponent;
  let fixture: ComponentFixture<ProductByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductByUserComponent]
    });
    fixture = TestBed.createComponent(ProductByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
