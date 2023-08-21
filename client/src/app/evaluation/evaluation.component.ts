import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../share/notification.service';
import { EvaluationService } from '../share/evaluation.service';
import { Router } from '@angular/router';
import { HOME_ROUTE } from '../constants/routes.constants';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css'],
})
export class EvaluationComponent implements OnInit {
  rating: number = 0;
  comentario: string = '';
  userId: number = 0;
  purchaseId: number = 0;

  constructor(
    private notification: NotificationService,
    private evaluationService: EvaluationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPurchaseId();
  }

  handleRatingClick(rating: number) {
    this.rating = rating;
  }

  send() {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      const userId = currentUser.user.UserId;

      this.evaluationService
        .sendEvaluation(userId, this.rating, this.comentario, this.purchaseId)
        .subscribe((response) => {
          console.log('response:', response);
          this.notification.showSuccess('Gracias por tu evaluación.');
          this.router.navigate([HOME_ROUTE]);
        });
      this.evaluationService.calculateAverageRating().subscribe((response) => {
        console.log('response:', response);
      });
    } else {
      this.notification.showError('No se ha encontrado el usuario.');
    }
  }

  loadPurchaseId() {
    const purchaseId = localStorage.getItem('purchaseId');
    if (purchaseId) {
      this.purchaseId = Number(purchaseId);
      console.log('purchaseId:', this.purchaseId);
    } else {
      console.log('No se ha encontrado el purchaseId en localStorage.');
    }
  }
}
