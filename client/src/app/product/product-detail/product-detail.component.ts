import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/share/product.service';
import { NotificationService } from 'src/app/share/notification.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  data: any;
  isFormVisible = false;
  formCreate!: FormGroup;
  showNewQuestion: boolean = false;
  showNewAnswer: boolean = false;
  currentUser: any;
  newQuestion: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  answerText: { [questionId: number]: string } = {};
  newAnswer: { [questionId: number]: string } = {};

  questionFormVisibility: { [questionId: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
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
        this.productService
          .createAnswer(questionId, this.answerText[questionId], userId)
          .subscribe(
            (response: any) => {
              this.notificationService.showSuccess(
                'Respuesta enviada correctamente.'
              );
              console.log('Respuesta enviada con éxito:', response);
              this.newAnswer[questionId] = '';
              window.location.reload();
            },
            (error) => {
              this.notificationService.showError(
                'Error al enviar la respuesta.'
              );
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
    this.productService
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
        this.productService
          .createQuestion(
            Number(productId),
            this.formCreate.get('comment')?.value,
            userId
          )
          .subscribe(
            (response: any) => {
              this.notificationService.showSuccess(
                'Pregunta enviada correctamente.'
              );
              console.log('Pregunta enviada con éxito:', response);
              this.data[0].Questions.push(response);
              this.newQuestion = response;
              this.formCreate.get('comment')?.setValue('');
              this.showNewQuestion = true;

              setTimeout(() => {
                this.showNewQuestion = false;
              }, 5000000000000000000);
            },
            (error) => {
              this.notificationService.showError(
                'Error al enviar la pregunta.'
              );
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
