// core/stats.service.ts
// saves and reads lifetime stats and recent game history in localStorage
import { Injectable, signal, computed } from '@angular/core';
import { GameRecord } from './models';

interface StatsData {
  gamesPlayed: number;
  totalScore: number;
  totalQuestions: number;
  history: GameRecord[]; // newest first, capped
}

const KEY = 'trivia.stats.v1';
const MAX_HISTORY = 20;

const EMPTY: StatsData = { gamesPlayed: 0, totalScore: 0, totalQuestions: 0, history: [] };

@Injectable({ providedIn: 'root' })
export class StatsService {
  private data = signal<StatsData>(this.load());

  readonly gamesPlayed = computed(() => this.data().gamesPlayed);
  readonly recentGames = computed(() => this.data().history);
  /** lifetime average as a 0–1 ratio (correct / total questions). */
  readonly lifetimeAccuracy = computed(() => {
    const d = this.data();
    return d.totalQuestions ? d.totalScore / d.totalQuestions : 0;
  });

  recordGame(record: GameRecord) {
    const d = this.data();
    const next: StatsData = {
      gamesPlayed: d.gamesPlayed + 1,
      totalScore: d.totalScore + record.score,
      totalQuestions: d.totalQuestions + record.total,
      history: [record, ...d.history].slice(0, MAX_HISTORY),
    };
    this.data.set(next);
    this.save(next);
  }

  private load(): StatsData {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      return EMPTY;
    }
  }

  private save(d: StatsData) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* storage full or blocked */ }
  }
}
