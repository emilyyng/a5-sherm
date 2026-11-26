// core/models.ts
// shared types + constants: quiz settings, question shape, game records, and the category list
export type Difficulty = 'easy' | 'medium' | 'hard';

export const CATEGORIES = [
  { slug: 'geography', label: 'Geography' },
  { slug: 'science', label: 'Science' },
  { slug: 'food_and_drink', label: 'Food & Drink' },
  { slug: 'film_and_tv', label: 'Film & TV' },
  { slug: 'music', label: 'Music' },
] as const;

export interface QuizSettings {
  difficulty: Difficulty;
  categories: string[];       // slugs
  timed: boolean;
  secondsPerQuestion: number; // used only when timed
}

export interface TriviaQuestion {
  id: string;
  category: string;
  difficulty: Difficulty;
  text: string;
  correctAnswer: string;
  options: string[]; // already shuffled
}

export interface GameRecord {
  playedAt: string; // ISO date
  score: number;
  total: number;
  settings: QuizSettings;
}