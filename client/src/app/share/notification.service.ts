import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

export enum TypeMessage {
  Success,
  Error,
  Info,
  Warning,
  Question,
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  options: IndividualConfig;
  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    this.options.enableHtml = true;
    this.options.positionClass = 'toast-top-right';
    this.options.disableTimeOut = false;
    this.options.closeButton = true;
  }
  public messageSuccess(
    title: string,
    message: string,
    typeMessage: TypeMessage
  ) {
    this.toastr.show(
      message,
      title,
      this.options,
      'toast-' + TypeMessage[typeMessage]
    );
  }
}
