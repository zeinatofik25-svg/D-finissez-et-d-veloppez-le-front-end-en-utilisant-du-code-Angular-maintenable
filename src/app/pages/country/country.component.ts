import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicService } from '../../services/olympic/olympic.service';
import { Country } from '../../models/country.model';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';

  constructor(private route: ActivatedRoute, private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const countryName = param.get('countryName');
      if (!countryName) {
        this.router.navigate(['not-found']);
        return;
      }

      this.olympicService.getCountries().subscribe(
        (data: Country[]) => {
          if (data && data.length > 0) {
            const selectedCountry = data.find((c) => c.country === countryName);
            if (!selectedCountry) {
              this.router.navigate(['not-found']);
              return;
            }
            this.titlePage = selectedCountry.country;
            const participations = selectedCountry.participations ?? [];
            this.totalEntries = participations.length;
            const years = participations.map((p) => p.year);
            const medals = participations.map((p) => p.medalsCount);
            this.totalMedals = medals.reduce((acc, m) => acc + m, 0);
            const nbAthletes = participations.map((p) => p.athleteCount);
            this.totalAthletes = nbAthletes.reduce((acc, a) => acc + a, 0);
            this.buildChart(years, medals);
          }
        },
        (error) => {
          this.error = error?.message ?? 'Erreur inconnue';
        }
      );
    });
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}
