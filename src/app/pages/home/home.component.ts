import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicService } from '../../services/olympic/olympic.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart;
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  titlePage = 'Medals per Country';

  constructor(private router: Router, private olympicService: OlympicService) {}

  ngOnInit() {
    this.olympicService.getCountries().subscribe(
      (data: Country[]) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.flatMap((c) => c.participations.map((p) => p.year)))).length;
          const countries: string[] = data.map((c) => c.country);
          this.totalCountries = countries.length;
          const sumOfAllMedalsYears = data.map((c) => c.participations.reduce((acc, p) => acc + p.medalsCount, 0));
          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      },
      (error) => {
        this.error = error?.message ?? 'Erreur inconnue';
      }
    );
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }
}

