import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

export enum MessageType {
  success,
  error,
  info,
  warning,
  question,
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  options: IndividualConfig;

  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    this.options.enableHtml = true;
    this.options.positionClass = 'toast-top-center';
    this.options.disableTimeOut = true;
    this.options.closeButton = true;
  }

  private showMessage(titulo: string, mensaje: string, tipo: keyof typeof MessageType) {
    this.toastr.show(mensaje, titulo, this.options, 'toast-' + MessageType[tipo]);
  }

  public messageSuccess(titulo: string, mensaje: string) {
    this.showMessage(titulo, mensaje, 'success');
  }

  public messageError(titulo: string, mensaje: string) {
    this.showMessage(titulo, mensaje, 'error');
  }

  public messageInfo(titulo: string, mensaje: string) {
    this.showMessage(titulo, mensaje, 'info');
  }

  public messageWarning(titulo: string, mensaje: string) {
    this.showMessage(titulo, mensaje, 'warning');
  }

  public messageQuestion(titulo: string, mensaje: string) {
    this.showMessage(titulo, mensaje, 'question');
  }
}
