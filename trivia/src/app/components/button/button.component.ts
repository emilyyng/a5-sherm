// components/button/button.component.ts
// the app's text button, in two looks:
//   <app-button>start game</app-button>                        filled blue (primary)
//   <app-button variant="outline" link="/">return home</app-button>   outlined, renders as a link
// type="submit" lets it submit a form; link="/path" makes it a router link
import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #label><ng-content /></ng-template>

    @if (link) {
      <a class="btn" [class.primary]="variant === 'primary'" [class.outline]="variant === 'outline'"
         [routerLink]="link">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <button class="btn" [class.primary]="variant === 'primary'" [class.outline]="variant === 'outline'"
              [type]="type" [disabled]="disabled">
        <ng-container [ngTemplateOutlet]="label" />
      </button>
    }
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' = 'primary';
  @Input() link = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
}