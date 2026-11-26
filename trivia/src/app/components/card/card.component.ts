// components/card/card.component.ts
// the cream rounded card every page sits in; put page content inside <app-card>…</app-card>
import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<section class="card"><ng-content /></section>`,
  styleUrl: './card.component.css',
})
export class CardComponent {}