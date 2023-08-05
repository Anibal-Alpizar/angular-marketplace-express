import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    this.showNotification(message, 'success-snackbar', duration);
  }

  showError(message: string, duration: number = 3000) {
    this.showNotification(message, 'error-snackbar', duration);
  }

  showWarning(message: string, duration: number = 3000) {
    this.showNotification(message, 'warning-snackbar', duration);
  }

  private showNotification(
    message: string,
    panelClass: string,
    duration: number
  ) {
    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    };

    this.snackBar.open(message, 'Dismiss', config);
  }
}
