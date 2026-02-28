import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import type { Chart as ChartType } from 'chart.js';
import { ChartService } from '../../services/chart/chart.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() elementId = 'pieChart';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() enableNavigation = false;

  private chart?: ChartType;
  private viewReady = false;

  private readonly chartService = inject(ChartService);
  private readonly router = inject(Router);

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!('labels' in changes) && !('data' in changes) && !('elementId' in changes) && !('enableNavigation' in changes)) {
      return;
    }
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.viewReady) {
      return;
    }

    if (this.labels.length === 0 || this.data.length === 0) {
      return;
    }

    this.chart?.destroy();
    this.chart = this.chartService.createChart(
      this.elementId,
      'pie',
      this.labels,
      this.data,
      undefined,
      {
        hoverOffset: 4,
        onDatasetClick: this.enableNavigation
          ? (index: number, labels: (string | number)[]) => {
              void this.router.navigate(['country', labels[index]]);
            }
          : undefined,
      }
    );
  }
}
