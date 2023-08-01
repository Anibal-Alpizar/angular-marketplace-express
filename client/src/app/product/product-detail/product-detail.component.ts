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
  isFormVisible = false;
  formCreate!: FormGroup; // Declare the formCreate variable as FormGroup
  destroy$: Subject<boolean> = new Subject<boolean>();
  showNewQuestion: boolean = false;
  showNewAnswer: boolean = false;
  newQuestion: any; 
  newAnswer: any;
  questionFormVisibility: { [questionId: number]: boolean } = {};

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

   // Método para alternar la visibilidad del formulario de respuesta para cada pregunta.
   toggleFormVisibility(question: any) {
    this.questionFormVisibility[question.QuestionId] = !this.questionFormVisibility[question.QuestionId];
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
  submitQuestion() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const productId = this.route.snapshot.paramMap.get('id');
      const userId = currentUser.user.UserId;
  
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
              this.data[0].Questions.push(response); // Agregamos la nueva pregunta a data
              this.newQuestion = response; // Almacenamos la nueva pregunta en la variable newQuestion
              this.formCreate.get('comment')?.setValue('');
              this.showNewQuestion = true; // Mostramos el div simulado temporalmente
  
              // Después de un tiempo (por ejemplo, 5 segundos), ocultamos el div simulado
              setTimeout(() => {
                this.showNewQuestion = false;
              }, 5000); 
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
  
  submitAnswer(questionId: number) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const QuestionId = this.route.snapshot.paramMap.get('id');
      const userId = currentUser.user.UserId;
  
      if (questionId !== null) {
        const formData = new FormData();
        formData.append('AnswerText', this.formCreate.get('comment')?.value);
        formData.append('QuestionId', questionId.valueOf.toString());
        formData.append('UserId', userId);
  
        const url = 'http://localhost:3000/createAnswers';
        const headers = new HttpHeaders();
  
        this.http
          .post(url, formData, { headers })
          .pipe(catchError(this.handleError))
          .subscribe(
            (response: any) => {
              console.log('Respuesta enviada con éxito', response);
         
              const question = this.data[0].Questions.find((q: any) => q.QuestionId === questionId);
              if (question) {
                question.Answers.push(response);
              }
  
              this.newAnswer = response;
              this.formCreate.get('comment')?.setValue('');
              this.showNewAnswer = true;
  
              setTimeout(() => {
                this.showNewAnswer = false;
              }, 5000);
            },
            (error) => {
              console.error('Error al enviar la respuesta:', error);
            }
          );
      } else {
        console.log('El ID de la Pregunta es nulo. No se puede crear una Respuesta.'); 
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
