import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StatisticsService, CountryStatistics } from '../../services/statistics/statistics.service';
import { ErrorService } from '../../services/error/error.service';
import { Subject, takeUntil } from 'rxjs';
import type { HeaderIndicator } from '../header/header.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  countryStats?: CountryStatistics;
  error?: string;
  indicators: HeaderIndicator[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private statisticsService: StatisticsService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((param: ParamMap) => {
      const countryName = param.get('countryName');
      if (!countryName) {
        this.router.navigate(['not-found']);
        return;
      }

      this.statisticsService
        .getCountryStatistics(countryName)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (stats) => {
            this.countryStats = stats;
            this.indicators = [
              { label: 'Number of entries', value: stats.years.length },
              { label: 'Total Number of medals', value: stats.totalMedals },
              { label: 'Total Number of athletes', value: stats.totalAthletes },
            ];
          },
          (err) => {
            this.error = this.errorService.handleError(err);
            this.router.navigate(['not-found']);
          }
        );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

