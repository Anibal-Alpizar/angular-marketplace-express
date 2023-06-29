import { Component, Input } from '@angular/core';
import { Product } from 'src/app/product/interfaces/product';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() filterProducts: Product[] = [];
}