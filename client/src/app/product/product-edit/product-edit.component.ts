import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/share/notification.service';
import { IMAGE1, IMAGE2, IMAGE3, IMAGE4 } from 'src/app/constants/images.constants';
import { FileReaderEventTarget } from 'src/app/interfaces/product-create.interface';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  categoryOptions: { value: string; label: string }[];
  image1Preview: string | undefined;
  image2Preview: string | undefined;
  image3Preview: string | undefined;
  image4Preview: string | undefined;
  image1File: File | undefined;
  image2File: File | undefined;
  image3File: File | undefined;
  image4File: File | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.categoryOptions = [
      { value: '1', label: 'Electrónica' },
      { value: '2', label: 'Hogar' },
      { value: '3', label: 'Deportes' },
    ];
  }

  ngOnInit() {
    this.createProductForm();

    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.getProductDetails(productId);
      }
    });
  }

  createProductForm() {
    this.productForm = this.formBuilder.group({
      productName: [''],
      price: [''],
      quantity: [''],
      category: [''],
      status: [''],
      description: [''],
    });
  }

  getProductDetails(productId: string) {
    this.http
      .get<any>(`http://localhost:3000/productsDetails/${productId}`)
      .subscribe(
        (data) => {
          console.log('Detalles del producto:', data);

          this.productForm.patchValue({
            productName: data[0].ProductName,
            price: data[0].Price,
            quantity: data[0].Quantity,
            category: data[0].CategoryId,
            status: data[0].Status,
            description: data[0].Description,
          });

          // Display image previews
          if (data[0].Photos && data[0].Photos.length >= 2) {
            this.image1Preview = data[0].Photos[0].PhotoURL;
            this.image2Preview = data[0].Photos[1].PhotoURL;
            this.image3Preview = data[0].Photos[2].PhotoURL;
            this.image4Preview = data[0].Photos[3].PhotoURL;

            // Save image URLs in variables
            const image1Url = data[0].Photos[0].PhotoURL;
            const image2Url = data[0].Photos[1].PhotoURL;
            const image3Url = data[0].Photos[2].PhotoURL;
            const image4Url = data[0].Photos[3].PhotoURL;
            this.notificationService.showSuccess(
              'Detalles del producto obtenidos correctamente.'
            );

            console.log('Image 1 URL:', image1Url);
            console.log('Image 2 URL:', image2Url);
            console.log('Image 3 URL:', image3Url);
            console.log('Image 4 URL:', image4Url);
          }
        },
        (error) => {
          console.error('Error al obtener los detalles del producto:', error);
          this.notificationService.showError(
            'Error al obtener los detalles del producto.'
          );
        }
      );
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('ProductName', this.productForm.get('productName')?.value);
    formData.append('Price', this.productForm.get('price')?.value);
    formData.append('Quantity', this.productForm.get('quantity')?.value);
    formData.append('Category', this.productForm.get('category')?.value);
    formData.append('Status', this.productForm.get('status')?.value);
    formData.append('Description', this.productForm.get('description')?.value);

    if (this.image1File) {
      formData.append('sampleFile', this.image1File, this.image1File.name);
    }

    if (this.image2File) {
      formData.append('sampleFile2', this.image2File, this.image2File.name);
    }

    if (this.image3File) {
      formData.append('sampleFile3', this.image3File, this.image3File.name);
    }

    if (this.image4File) {
      formData.append('sampleFile4', this.image4File, this.image4File.name);
    }

    const productId = this.route.snapshot.paramMap.get('id');

    this.http
      .put<any>(`http://localhost:3000/products/${productId}`, formData)
      .subscribe(
        (response) => {
          this.notificationService.showSuccess(
            'Producto actualizado correctamente.'
          );
          console.log('Product updated successfully:', response);
          this.router.navigate(['/product', productId]);
        },
        (error) => {
          this.notificationService.showError(
            'Error al actualizar el producto.'
          );
          console.error('Error updating product:', error);
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
      } else if (imageNumber === IMAGE3) {
        this.image3File = file;
        this.showImagePreview(file, IMAGE3);
      } else if (imageNumber === IMAGE4) {
        this.image4File = file;
        this.showImagePreview(file, IMAGE4);
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
      } else if (imageNumber === IMAGE3) {
        this.image3Preview = target.result?.toString();
      } else if (imageNumber === IMAGE4) {
        this.image4Preview = target.result?.toString();
      }
    };
    reader.readAsDataURL(file);
  }
}
