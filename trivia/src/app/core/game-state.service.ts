// core/game-state.service.ts
// holds the current game's state (settings, questions, score, progress) and drives it forward
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { QuizSettings, TriviaQuestion } from './models';
import { TriviaApiService } from './trivia-api.service';
import { StatsService } from './stats.service';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private api = inject(TriviaApiService);
  private stats = inject(StatsService);

  readonly settings = signal<QuizSettings | null>(null);
  readonly questions = signal<TriviaQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly score = signal(0);
  /** one entry per answered question, in order: true = right, false = wrong or timed out. */
  readonly answers = signal<boolean[]>([]);
  readonly finished = signal(false);

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);
  readonly total = computed(() => this.questions().length);

  /** called from Start (new settings) and Results ("play again" passes the same settings). */
  start(settings: QuizSettings): Observable<TriviaQuestion[]> {
    return this.api.getQuestions(settings).pipe(
      tap(questions => {
        this.settings.set(settings);
        this.questions.set(questions);
        this.currentIndex.set(0);
        this.score.set(0);
        this.answers.set([]);
        this.finished.set(false);
      }),
    );
  }

  replay(): Observable<TriviaQuestion[]> {
    return this.start(this.settings()!);
  }

  recordAnswer(correct: boolean) {
    this.answers.update(a => [...a, correct]);
    if (correct) this.score.update(s => s + 1);
  }

  /** returns true if there was a next question, false if the game just ended. */
  advance(): boolean {
    if (this.currentIndex() + 1 < this.total()) {
      this.currentIndex.update(i => i + 1);
      return true;
    }
    this.finished.set(true);
    this.stats.recordGame({
      playedAt: new Date().toISOString(),
      score: this.score(),
      total: this.total(),
      settings: this.settings()!,
    });
    return false;
  }
}