import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { DataService } from '../../services/data/data.service';
import { Country } from '../../models/country.model';
import { ChartService } from '../../services/chart/chart.service';
import { ErrorService } from '../../services/error/error.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  public lineChart!: Chart;
  public titlePage: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error?: string;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private chartService: ChartService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((param: ParamMap) => {
      countryName = param.get('countryName');
      if (!countryName) {
        this.router.navigate(['not-found']);
        return;
      }

      this.dataService
        .getCountries()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: Country[]) => {
            if (data && data.length > 0) {
              const selectedCountry = data.find((c) => c.country === countryName);
              if (!selectedCountry) {
                this.router.navigate(['not-found']);
                return;
              }
              this.titlePage = selectedCountry.country;
              const participations = selectedCountry?.participations.map((i: any) => i) ?? [];
              this.totalEntries = participations?.length ?? 0;
              const years: number[] = participations.map((p) => p.year) ?? [];
              const medals: number[] = participations.map((p) => p.medalsCount) ?? [];
              this.totalMedals = medals.reduce((acc: number, m: number) => acc + m, 0);
              const nbAthletes: number[] = participations.map((p) => p.athleteCount);
              this.totalAthletes = nbAthletes.reduce((acc: number, a: number) => acc + a, 0);
              this.lineChart = this.chartService.createChart('countryChart', 'line', years, medals);
            }
          },
          (err) => {
            this.error = this.errorService.handleError(err);
          }
        );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
