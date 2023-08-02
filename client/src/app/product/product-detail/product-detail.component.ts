import { Component, OnInit } from '@angular/core';
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
export class ProductDetailComponent implements OnInit {
  data: any;
  isFormVisible = false;
  formCreate!: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  showNewQuestion: boolean = false;
  showNewAnswer: boolean = false;
  currentUser: any;
  answerText: { [questionId: number]: string } = {};
  newQuestion: any;
  newAnswer: { [questionId: number]: string } = {};

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
    this.createForm();
  }

  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.currentUser = JSON.parse(currentUserString);
    }
  }

  toggleFormVisibility(questionId: number) {
    console.log('ID de la pregunta:', questionId);
    this.questionFormVisibility[questionId] =
      !this.questionFormVisibility[questionId];
  }

  submitAnswer(questionId: number) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      const productId = this.route.snapshot.paramMap.get('id');
      const userId = currentUser.user.UserId;

      if (productId !== null) {
        const url = 'http://localhost:3000/createAnswers';
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        const answerData = {
          AnswerText: this.answerText[questionId],
          QuestionId: questionId,
          UserId: userId,
        };

        this.http
          .post(url, answerData, { headers })
          .pipe(catchError(this.handleError))
          .subscribe(
            (response: any) => {
              console.log('Respuesta enviada con éxito:', response);
              this.newAnswer[questionId] = '';
            },
            (error) => {
              console.error('Error al enviar la respuesta:', error);
            }
          );
      } else {
        console.log(
          'El ID del producto es nulo. No se puede crear una respuesta.'
        );
      }
    }
  }

  createForm() {
    this.formCreate = this.formBuilder.group({
      comment: '',
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
              this.data[0].Questions.push(response);
              this.newQuestion = response;
              this.formCreate.get('comment')?.setValue('');
              this.showNewQuestion = true;

              setTimeout(() => {
                this.showNewQuestion = false;
              }, 5000);
            },
            (error) => {
              console.error('Error al enviar la pregunta:', error);
            }
          );
      } else {
        console.log(
          'El ID del producto es nulo. No se puede crear una pregunta.'
        );
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
