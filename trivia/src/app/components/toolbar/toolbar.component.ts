// components/toolbar/toolbar.component.ts
// top-right icon buttons shown on every page: lifetime stats + light/dark mode
import { Component, inject } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [IconButtonComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  theme = inject(ThemeService);
}