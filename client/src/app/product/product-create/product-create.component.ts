import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private http: HttpClient,
    private router: Router
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
    formData.append('productName', this.formCreate.get('productName')?.value);
    formData.append('price', this.formCreate.get('price')?.value);
    formData.append('quantity', this.formCreate.get('quantity')?.value);
    formData.append('category', this.formCreate.get('category')?.value);
    formData.append('status', this.formCreate.get('status')?.value);
    formData.append('description', this.formCreate.get('description')?.value);

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

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    this.http
      .post('http://localhost:3000/createproducts', formData, {
        headers: headers,
      })
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.router.navigate(['/products/all']);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );

    console.log('Formulario:', this.formCreate.value);
  }

  onFileSelected(event: any, imageNumber: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      if (imageNumber === 'image1') {
        this.image1File = file;
        this.showImagePreview(file, 'image1');
      } else if (imageNumber === 'image2') {
        this.image2File = file;
        this.showImagePreview(file, 'image2');
      }
    }
  }

  showImagePreview(file: File, imageNumber: string) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (imageNumber === 'image1') {
        this.image1Preview = event.target.result;
      } else if (imageNumber === 'image2') {
        this.image2Preview = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
