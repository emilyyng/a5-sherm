import { Routes } from '@angular/router';
import { activeGameGuard, finishedGameGuard } from './core/game.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/start/start.component').then(m => m.StartComponent) },
  { path: 'quiz', canActivate: [activeGameGuard],
    loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent) },
  { path: 'results', canActivate: [finishedGameGuard],
    loadComponent: () => import('./features/results/results.component').then(m => m.ResultsComponent) },
  { path: 'stats', loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent) },
  { path: '**', redirectTo: '' },
];