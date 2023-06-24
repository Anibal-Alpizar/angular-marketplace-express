import { Component, Input } from '@angular/core';
import { Product } from 'src/app/product/interfaces/product';
import { Column } from 'src/app/product/interfaces/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() columns!: Column[];
  @Input() products!: Product[];
}
