// features/stats/stats.component.ts
// stats screen logic: exposes lifetime totals and recent games from the stats service
import { Component, inject } from '@angular/core';
import { PercentPipe, DatePipe } from '@angular/common';
import { StatsService } from '../../core/stats.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [PercentPipe, DatePipe, CardComponent, ButtonComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent {
  stats = inject(StatsService);
}