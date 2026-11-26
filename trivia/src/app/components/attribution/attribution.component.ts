// components/attribution/attribution.component.ts
// "questions from the trivia api" credit; drop it at the bottom of any card that shows questions
import { Component } from '@angular/core';

@Component({
  selector: 'app-attribution',
  standalone: true,
  template: `
    <p class="credit">
      questions from
      <a href="https://the-trivia-api.com" target="_blank" rel="noopener">the trivia api</a>
    </p>
  `,
  styleUrl: './attribution.component.css',
})
export class AttributionComponent {}