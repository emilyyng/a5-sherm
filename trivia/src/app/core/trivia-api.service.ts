// core/trivia-api.service.ts
// fetches questions from The Trivia API and converts them into the app's own question model
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QuizSettings, TriviaQuestion } from './models';

interface ApiQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: { text: string };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: string;
}

const QUESTIONS_PER_GAME = 5;

@Injectable({ providedIn: 'root' })
export class TriviaApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://the-trivia-api.com/v2';

  getQuestions(settings: QuizSettings): Observable<TriviaQuestion[]> {
    const params = new HttpParams()
      .set('limit', QUESTIONS_PER_GAME)
      .set('categories', settings.categories.join(','))
      .set('difficulties', settings.difficulty);

    return this.http.get<ApiQuestion[]>(`${this.baseUrl}/questions`, { params }).pipe(
      map(items =>
        items
          .filter(q => q.type === 'text_choice')
          .map(q => ({
            id: q.id,
            category: q.category,
            difficulty: q.difficulty,
            text: q.question.text,
            correctAnswer: q.correctAnswer,
            options: this.shuffle([q.correctAnswer, ...q.incorrectAnswers]),
          })),
      ),
    );
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}