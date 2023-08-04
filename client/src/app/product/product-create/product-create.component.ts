import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCreateService } from 'src/app/share/product-create.service';
import { IMAGE1, IMAGE2 } from 'src/app/constants/images.constants';
import { ALLPRODUCTS_ROUTE } from 'src/app/constants/routes.constants';
import { FileReaderEventTarget } from 'src/app/interfaces/product-create.interface';
import {
  ProductCreateError,
  ProductCreateResponse,
} from 'src/app/interfaces/product-create.interface';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent {
  formCreate: FormGroup;
  categoryOptions: { value: string; label: string }[];
  image1File: File | null = null;
  image2File: File | null = null;

  image1Preview: string | undefined;
  image2Preview: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductCreateService
  ) {
    this.categoryOptions = [
      { value: '1', label: 'Electrónica' },
      { value: '2', label: 'Hogar' },
      { value: '3', label: 'Deportes' },
    ];

    this.formCreate = this.formBuilder.group({
      productName: '',
      price: '',
      quantity: '',
      category: '',
      status: '',
      description: '',
    });
  }

  onSubmit() {
    const formData = new FormData();

    if (this.image1File) {
      formData.append('sampleFile', this.image1File, this.image1File.name);
    }

    if (this.image2File) {
      formData.append('sampleFile2', this.image2File, this.image2File.name);
    }

    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const userId = currentUser?.user?.UserId;

      console.log('UserId:', userId);

      if (userId) {
        formData.append('UserId', userId);
      } else {
        console.log('UserId no encontrado en el objeto currentUser.');
      }
    } else {
      console.log('No se encontró el objeto currentUser en el localStorage.');
    }

    formData.append('ProductName', this.formCreate.get('productName')?.value);
    formData.append('Description', this.formCreate.get('description')?.value);
    formData.append('Price', this.formCreate.get('price')?.value);
    formData.append('Quantity', this.formCreate.get('quantity')?.value);
    formData.append('CategoryId', this.formCreate.get('category')?.value);
    formData.append('Status', this.formCreate.get('status')?.value);

    this.productService.createProduct(formData).subscribe(
      (response: ProductCreateResponse) => {
        console.log('Response:', response);
        this.formCreate.reset();
        this.image1File = null;
        this.image2File = null;
        this.image1Preview = undefined;
        this.image2Preview = undefined;
        this.router.navigate([ALLPRODUCTS_ROUTE]);
      },
      (error: ProductCreateError) => {
        console.error('Error:', error);
      }
    );
  }

  onFileSelected(event: Event, imageNumber: string) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      const file: File = files[0];
      if (imageNumber === IMAGE1) {
        this.image1File = file;
        this.showImagePreview(file, IMAGE1);
      } else if (imageNumber === IMAGE2) {
        this.image2File = file;
        this.showImagePreview(file, IMAGE2);
      }
    }
  }

  showImagePreview(file: File, imageNumber: string) {
    const reader = new FileReader();
    reader.onload = (event: Event) => {
      const target = event.target as FileReaderEventTarget;
      if (imageNumber === IMAGE1) {
        this.image1Preview = target.result?.toString();
      } else if (imageNumber === IMAGE2) {
        this.image2Preview = target.result?.toString();
      }
    };
    reader.readAsDataURL(file);
  }
}
