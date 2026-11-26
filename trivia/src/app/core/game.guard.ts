// core/game.guard.ts
// route guards that redirect home if someone opens /quiz or /results without a valid game
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStateService } from './game-state.service';

export const activeGameGuard: CanActivateFn = () => {
  const g = inject(GameStateService);
  return (g.questions().length > 0 && !g.finished()) || inject(Router).createUrlTree(['/']);
};

export const finishedGameGuard: CanActivateFn = () =>
  inject(GameStateService).finished() || inject(Router).createUrlTree(['/']);