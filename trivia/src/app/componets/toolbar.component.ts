// components/toolbar/toolbar.component.ts
// top-right icon buttons shown on every page: lifetime stats + light/dark mode
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  // TODO: wire up light/dark theme (and save the choice to device storage)
  toggleTheme() {}
}