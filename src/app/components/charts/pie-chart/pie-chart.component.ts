import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import type { Chart } from 'chart.js/auto';
import { ChartService } from '../../../services/chart/chart.service';

@Component({
  selector: 'app-pie-chart',
  template: `
    <div class="chart-container wrapper-container">
      <div class="container">
        <canvas #canvasRef [id]="elementId"></canvas>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    :host ::ng-deep .container {
      position: relative;
      width: 100%;
      max-width: 500px;
      height: auto;
    }
  `]
})
export class PieChartComponent implements AfterViewInit, OnDestroy {
  @Input() elementId = 'pieChart';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() enableNavigation = false;
  @ViewChild('canvasRef') canvasRef?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private destroy$ = new Subject<void>();
  private chartInitialized = false;

  constructor(
    private chartService: ChartService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Initialize chart after view is fully rendered
    if (!this.chartInitialized && this.labels.length > 0 && this.data.length > 0) {
      this.initializeChart();
    }
  }

  private initializeChart() {
    this.chartInitialized = true;
    this.chart = this.chartService.createChart(
      this.elementId,
      'pie',
      this.labels,
      this.data,
      undefined,
      {
        hoverOffset: 4,
        onDatasetClick: this.enableNavigation
          ? (index: number) => this.router.navigate(['country', this.labels[index]])
          : undefined,
      }
    );
  }

  ngOnDestroy() {
    this.chart?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
