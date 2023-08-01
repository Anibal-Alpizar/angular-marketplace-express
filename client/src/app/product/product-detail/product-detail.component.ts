import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  data: any;
  formCreate!: FormGroup; // Declare the formCreate variable as FormGroup
  destroy$: Subject<boolean> = new Subject<boolean>();
  showNewQuestion: boolean = false;
    newQuestion: any; 

  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) {
      this.getProduct(Number(id));

    }
    this.createForm(); // Call the method to create the form
  }

   

  createForm() {
    this.formCreate = this.formBuilder.group({
      comment: '', // Add any other form fields you need here
    });
  }

  getProduct(id: any) {
    this.gService
      .getProductDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.data = data;
      });
  }

  displayData() {
  const currentUserString = localStorage.getItem('currentUser');
  if (currentUserString) {
    const currentUser = JSON.parse(currentUserString);
    const productId = this.route.snapshot.paramMap.get('id');
    const userId = currentUser.user.UserId;

    console.log(currentUser, productId, userId);

    if (productId !== null) {
      const formData = new FormData();
      formData.append('QuestionText', this.formCreate.get('comment')?.value);
      formData.append('ProductId', productId);
      formData.append('UserId', userId);

      const url = 'http://localhost:3000/createQuestions';
      const headers = new HttpHeaders();

      this.http
        .post(url, formData, { headers })
        .pipe(catchError(this.handleError))
        .subscribe(
          (response: any) => {
            console.log('Pregunta enviada con éxito:', response);
            
            this.data.push(response); // Agregamos la nueva pregunta a data
            this.newQuestion = response; // Almacenamos la nueva pregunta en la variable newQuestion
            
            this.formCreate.get('comment')?.setValue('');
            this.showNewQuestion = true; // Mostramos el div simulado temporalmente

            // Después de un tiempo (por ejemplo, 5 segundos), ocultamos el div simulado
            setTimeout(() => {
              this.showNewQuestion = false;
            }, 10000000000); 
            
          },
          (error) => {
            console.error('Error al enviar la pregunta:', error);
          }
        );
    } else {
      console.log('El ID del producto es nulo. No se puede crear una pregunta.'); 
    }
  }
}

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
