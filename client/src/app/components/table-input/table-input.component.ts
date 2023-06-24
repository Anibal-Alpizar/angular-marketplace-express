import { Component, Input } from '@angular/core';
import { Column } from '../interfaces/table';
import { Product } from 'src/app/product/interfaces/product';

@Component({
  selector: 'app-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.css']
})
export class TableInputComponent {
  @Input() columns!: Column[];
  @Input() products!: Product[];
}
