import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationComponent } from './evaluation.component';
import { EvaluationRoutingModule } from './evaluation-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EvaluationComponent],
  imports: [CommonModule, EvaluationRoutingModule, FormsModule],
})
export class EvaluationModule {}
