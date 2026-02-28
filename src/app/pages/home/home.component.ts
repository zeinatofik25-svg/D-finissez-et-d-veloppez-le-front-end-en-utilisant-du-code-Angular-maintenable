import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { Country } from '../../models/country.model';
import { ChartService } from '../../services/chart/chart.service';
import { ErrorService } from '../../services/error/error.service';
import { Subject, takeUntil } from 'rxjs';
import type { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public pieChart?: Chart;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public error?: string;
  titlePage: string = 'Medals per Country';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private dataService: DataService,
    private chartService: ChartService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.dataService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: Country[]) => {
          if (data && data.length > 0) {
            this.totalJOs = Array.from(
              new Set(data.flatMap((c) => c.participations.map((p) => p.year)))
            ).length;
            const countries: string[] = data.map((c) => c.country);
            this.totalCountries = countries.length;
            const sumOfAllMedalsYears: number[] = data.map((c) =>
              c.participations.reduce((acc, p) => acc + p.medalsCount, 0)
            );
            this.pieChart = this.chartService.createChart(
              'DashboardPieChart',
              'pie',
              countries,
              sumOfAllMedalsYears,
              undefined,
              {
                onDatasetClick: (index) => {
                  const selectedCountry = countries[index];
                  this.router.navigate(['country', selectedCountry]);
                },
                hoverOffset: 4,
              }
            );
          }
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

