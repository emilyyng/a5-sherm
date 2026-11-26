// core/theme.service.ts
// light / dark mode: sets data-theme on <html> (styles.css swaps the colors + background image)
// and remembers the player's choice in localStorage. first visit follows the device setting.
import { Injectable, computed, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'whileuwait-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initialTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // keep <html data-theme="..."> in sync with the signal
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });
  }

  toggle() {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.theme.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);   // only saved once the player picks one
    } catch {
      /* storage blocked (private mode etc.): the toggle still works for this visit */
    }
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}