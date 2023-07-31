import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
export enum TipoMessage {
  error,
  info,
  success,
  warning,
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

  public mensaje(titulo: string, mensaje: string, tipo: TipoMessage) {
    this.toastr.show(
      mensaje,
      titulo,
      this.options,
      'toast-' + TipoMessage[tipo]
    );
  }
}
