// components/score-row/score-row.component.ts
// row of four-point sparkles showing how each question went:
//   <app-score-row [results]="['correct','wrong','pending','pending','pending']" />
//   mode="shape" (default): correct = filled sparkle, wrong = empty outline, pending = small dot
//   mode="color": correct = green sparkle, wrong = red sparkle (both filled)
// size it from the parent with --spark-size (default 40px) and --spark-gap (default 6px)
import { Component, Input } from '@angular/core';

export type ScoreState = 'correct' | 'wrong' | 'pending';

@Component({
  selector: 'app-score-row',
  standalone: true,
  templateUrl: './score-row.component.html',
  styleUrl: './score-row.component.css',
})
export class ScoreRowComponent {
  @Input({ required: true }) results: ScoreState[] = [];
  @Input() mode: 'shape' | 'color' = 'shape';
  /** sparkles pop in one after another (skipped when the player prefers reduced motion) */
  @Input() animate = false;
  /** optional custom screen-reader text; otherwise it's built from the results */
  @Input() label = '';

  get ariaLabel(): string {
    if (this.label) return this.label;
    const count = (s: ScoreState) => this.results.filter(x => x === s).length;
    return `${count('correct')} correct, ${count('wrong')} wrong, ${count('pending')} to go`;
  }
}