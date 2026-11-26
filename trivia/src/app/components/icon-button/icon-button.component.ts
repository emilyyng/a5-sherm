// components/icon-button/icon-button.component.ts
// round 44px icon button. put an <svg> inside it.
//   <app-icon-button label="pause timer"><svg>…</svg></app-icon-button>   -> <button>, listen with (click)
//   <app-icon-button label="stats" link="/stats" [circle]="true">…</app-icon-button> -> <a routerLink>
// circle = cream background + shadow (toolbar); without it the icon floats on the card (pause button)
import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #icon><ng-content /></ng-template>

    @if (link) {
      <a class="icon-btn" [class.circle]="circle" [routerLink]="link"
         [attr.aria-label]="label" [attr.title]="label">
        <ng-container [ngTemplateOutlet]="icon" />
      </a>
    } @else {
      <button type="button" class="icon-btn" [class.circle]="circle"
              [attr.aria-label]="label" [attr.title]="label" [disabled]="disabled">
        <ng-container [ngTemplateOutlet]="icon" />
      </button>
    }
  `,
  styleUrl: './icon-button.component.css',
})
export class IconButtonComponent {
  /** required: icon-only buttons need a name for screen readers */
  @Input({ required: true }) label = '';
  @Input() link = '';
  @Input() circle = false;
  @Input() disabled = false;
}