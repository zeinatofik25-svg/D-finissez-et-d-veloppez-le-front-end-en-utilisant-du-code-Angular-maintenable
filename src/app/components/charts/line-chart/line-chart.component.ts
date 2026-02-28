import { Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import type { Chart } from 'chart.js/auto';
import { ChartService } from '../../../services/chart/chart.service';

@Component({
  selector: 'app-line-chart',
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
      height: auto;
    }
  `]
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  @Input() elementId = 'lineChart';
  @Input() labels: (string | number)[] = [];
  @Input() data: number[] = [];
  @ViewChild('canvasRef') canvasRef?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private destroy$ = new Subject<void>();
  private chartInitialized = false;

  constructor(private chartService: ChartService) {}

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
      'line',
      this.labels,
      this.data
    );
  }

  ngOnDestroy() {
    this.chart?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
