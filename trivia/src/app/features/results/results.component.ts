// features/results/results.component.ts
// results screen logic: score message plus "play again" (same settings) and "return home" actions.
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/game-state.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ScoreRowComponent, ScoreState } from '../../components/score-row/score-row.component';
import { CATEGORIES } from '../../core/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CardComponent, ButtonComponent, ScoreRowComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  game = inject(GameStateService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // one sparkle per question, in order: green = right, red = wrong or no answer
  readonly scores = computed<ScoreState[]>(() =>
    this.game.answers().map(right => (right ? 'correct' : 'wrong')),
  );
  readonly sparkLabel = computed(() => `${this.game.score()} of ${this.game.total()} correct`);

  readonly message = computed(() => {
    const ratio = this.game.score() / (this.game.total() || 1);
    if (ratio === 1) return 'Perfect score!';
    if (ratio >= 0.6) return 'Nice work!';
    if (ratio >= 0.4) return 'Not bad. Try again?';
    return 'Better luck next time.';
  });

  // "all categories" if every category was picked, otherwise the picked category names
  readonly categoryText = computed(() => {
    const picked = this.game.settings()?.categories ?? [];
    if (CATEGORIES.every(c => picked.includes(c.slug))) return 'all categories';
    return picked.map(slug => CATEGORIES.find(c => c.slug === slug)?.label ?? slug).join(', ');
  });

  playAgain() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.game.replay().subscribe({
      next: () => this.router.navigateByUrl('/quiz'),
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load new questions. Please try again.');
      },
    });
  }

  returnHome() { this.router.navigateByUrl('/'); }
}