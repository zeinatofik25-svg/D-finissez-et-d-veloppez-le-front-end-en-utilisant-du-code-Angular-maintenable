import { Component, OnDestroy, OnInit } from '@angular/core';
import { StatisticsService, OlympicStatistics } from '../../services/statistics/statistics.service';
import { ErrorService } from '../../services/error/error.service';
import { Subject, takeUntil } from 'rxjs';
import type { HeaderIndicator } from '../header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  stats?: OlympicStatistics;
  error?: string;
  titlePage = 'Medals per Country';
  indicators: HeaderIndicator[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private statisticsService: StatisticsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.statisticsService
      .getGlobalStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (stats) => {
          this.stats = stats;
          this.indicators = [
            { label: 'Number of countries', value: stats.totalCountries },
            { label: 'Number of JOs', value: stats.totalJOs },
          ];
        },
        (err) => {
          this.error = this.errorService.handleError(err);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


