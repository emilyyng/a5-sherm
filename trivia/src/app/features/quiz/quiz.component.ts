// features/quiz/quiz.component.ts
// quiz screen logic: shows one question at a time, runs a smooth countdown (with pause) for each
// question, keeps a sparkle per question, and reveals answers
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { GameStateService } from '../../core/game-state.service';
import { CardComponent } from '../../components/card/card.component';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { AttributionComponent } from '../../components/attribution/attribution.component';
import { ScoreRowComponent, ScoreState } from '../../components/score-row/score-row.component';


const REVEAL_WRONG_MS = 2000;
const REVEAL_CORRECT_MS = 800;
const TICK_MS = 100;   // the countdown updates 10x a second so the bar moves smoothly

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CardComponent, ScoreRowComponent, IconButtonComponent, AttributionComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit, OnDestroy {
  game = inject(GameStateService);
  private router = inject(Router);

  readonly selected = signal<string | null>(null);
  readonly revealed = signal(false);
  readonly timedOut = signal(false);
  readonly paused = signal(false);

  // time left on this question, in milliseconds
  readonly timeLeftMs = signal(0);
  // whole seconds shown next to the pause button (15, 14, 13 ... 0)
  readonly timeLeft = computed(() => Math.ceil(this.timeLeftMs() / 1000));
  // how full the timer bar is (100 -> 0)
  readonly timePercent = computed(() => {
    const s = this.game.settings();
    return s?.timed ? (this.timeLeftMs() / (s.secondsPerQuestion * 1000)) * 100 : 0;
  });

  // one sparkle per question: filled = right, empty = wrong, small dot until answered
  readonly scores = computed<ScoreState[]>(() => {
    const r = this.game.answers();   // true = right, false = wrong, one entry per answered question
    return Array.from({ length: this.game.total() }, (_, i) =>
      i < r.length ? (r[i] ? 'correct' : 'wrong') : 'pending',
    );
  });

  private tick?: Subscription;
  private lastTick = 0;
  private revealTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() { this.beginQuestion(); }

  ngOnDestroy() {
    this.stopTimer();
    clearTimeout(this.revealTimeout);
  }

  private beginQuestion() {
    this.selected.set(null);
    this.revealed.set(false);
    this.timedOut.set(false);
    this.paused.set(false);

    const s = this.game.settings()!;
    if (!s.timed) return;

    this.timeLeftMs.set(s.secondsPerQuestion * 1000);
    this.startTick();
  }

  private startTick() {
    this.stopTimer();
    this.lastTick = performance.now();
    this.tick = interval(TICK_MS).subscribe(() => {
      // subtract the real time that passed, so it stays accurate even if the browser throttles the tab
      const now = performance.now();
      this.timeLeftMs.update(ms => Math.max(0, ms - (now - this.lastTick)));
      this.lastTick = now;

      if (this.timeLeftMs() <= 0) {
        this.timedOut.set(true);
        this.answer(null); // timeout counts as wrong
      }
    });
  }

  togglePause() {
    if (this.revealed()) return; // nothing to pause while the answer is showing
    if (this.paused()) {
      this.paused.set(false);
      this.startTick();          // picks up from the exact time left
    } else {
      this.paused.set(true);
      this.stopTimer();
    }
  }

  answer(option: string | null) {
    if (this.revealed() || this.paused()) return; // ignore double-clicks and clicks while paused
    this.stopTimer();
    this.selected.set(option);
    this.revealed.set(true);

    const correct = option === this.game.currentQuestion()!.correctAnswer;
    this.game.recordAnswer(correct);

    this.revealTimeout = setTimeout(
      () => this.next(),
      correct ? REVEAL_CORRECT_MS : REVEAL_WRONG_MS,
    );
  }

  optionClass(option: string): string {
    if (!this.revealed()) return '';
    const correctAnswer = this.game.currentQuestion()!.correctAnswer;
    if (option === correctAnswer) return 'correct';
    if (option === this.selected()) return 'wrong';
    return 'dimmed';
  }

  private next() {
    if (this.game.advance()) this.beginQuestion();
    else this.router.navigateByUrl('/results');
  }

  private stopTimer() { this.tick?.unsubscribe(); }
}