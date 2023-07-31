import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/share/categories.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  categories: any;
  formCreate!: FormGroup;

  constructor(private cServices: CategoriesService, public fb: FormBuilder) {
    this.reactiveForm();
  }
  ngOnInit(): void {}

  reactiveForm() {
    this.formCreate = this.fb.group({
      productName: ['', [Validators.required]],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      status: ['', [Validators.required]],
      image1: ['', [Validators.required]],
      image2: ['', [Validators.required]],
    });
    this.getCategories();
  }

  getCategories() {
    this.cServices
      .list('/getcategories')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.categories = data;
        console.log(this.categories);
      });
  }
}
