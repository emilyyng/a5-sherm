// features/start/start.component.ts
// start screen logic: settings form (timer, difficulty, categories), then loads questions and begins the game
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORIES, Difficulty, QuizSettings } from '../../core/models';
import { GameStateService } from '../../core/game-state.service';
import { CardComponent } from '../../components/card/card.component';
import { SegmentedComponent, SegmentedOption } from '../../components/segmented/segmented.component';
import { AttributionComponent } from '../../components/attribution/attribution.component';

// players don't choose this; change the number here to retime the whole game
const SECONDS_PER_QUESTION = 15;

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, SegmentedComponent, AttributionComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css',
})
export class StartComponent {
  private fb = inject(FormBuilder);
  private game = inject(GameStateService);
  private router = inject(Router);

  readonly categories = CATEGORIES;

  readonly timerOptions: SegmentedOption[] = [
    { value: true, label: 'timer' },
    { value: false, label: 'no timer' },
  ];
  readonly difficultyOptions: SegmentedOption[] = (['easy', 'medium', 'hard'] as Difficulty[]).map(
    d => ({ value: d, label: d }),
  );

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Prefill from the last game so "Return home" keeps the previous choices
  private prev = this.game.settings();

  form = this.fb.nonNullable.group({
    difficulty: [this.prev?.difficulty ?? ('medium' as Difficulty), Validators.required],
    categories: [
      this.prev?.categories ?? (CATEGORIES.map(c => c.slug) as string[]),
      [Validators.required, Validators.minLength(1)],
    ],
    timed: [this.prev?.timed ?? true],
    secondsPerQuestion: [SECONDS_PER_QUESTION],
  });

  isSelected(slug: string): boolean {
    return this.form.controls.categories.value.includes(slug);
  }

  toggleCategory(slug: string) {
    const ctrl = this.form.controls.categories;
    const cur = ctrl.value;
    ctrl.setValue(cur.includes(slug) ? cur.filter(c => c !== slug) : [...cur, slug]);
    ctrl.markAsTouched();
  }

  start() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    this.game.start(this.form.getRawValue() as QuizSettings).subscribe({
      next: () => this.router.navigateByUrl('/quiz'),
      error: err => {
        this.loading.set(false);
        this.error.set(
          err.status === 429
            ? 'too many requests. wait a few seconds and try again.'
            : 'could not load questions. please try again.',
        );
      },
    });
  }
}