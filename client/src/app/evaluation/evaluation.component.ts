import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../share/notification.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css'],
})
export class EvaluationComponent implements OnInit {
  numeroSeleccionado: number | null = null;
  comentario: string = '';
  userId: number = 0;
  purchaseId: number = 0;

  constructor(private notification: NotificationService) {}

  ngOnInit(): void {
    this.getUserId();
    this.loadPurchaseId();
  }

  handleRatingClick(rating: number) {
    this.numeroSeleccionado = rating;
  }

  send() {
    if (this.numeroSeleccionado !== null) {
      console.log('Número seleccionado:', this.numeroSeleccionado);
      console.log('Comentario:', this.comentario);
    } else {
      console.log('No se ha seleccionado ningún número.');
    }
  }

  getUserId() {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.user && currentUser.user.UserId) {
        const userId = currentUser.user.UserId;
        console.log('userId:', userId);
      }
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
