import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import type { Chart as ChartType } from 'chart.js';
import { ChartService } from '../../services/chart/chart.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() elementId = 'lineChart';
  @Input() labels: Array<string | number> = [];
  @Input() data: number[] = [];

  private chart?: ChartType;
  private viewReady = false;

  constructor(private readonly chartService: ChartService) {}

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderOrUpdateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!('labels' in changes) && !('data' in changes) && !('elementId' in changes)) {
      return;
    }

    this.renderOrUpdateChart(changes);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderOrUpdateChart(changes?: SimpleChanges): void {
    if (!this.viewReady) {
      return;
    }

    if (this.labels.length === 0 || this.data.length === 0) {
      return;
    }

    const elementIdChanged = !!changes?.['elementId'] && !changes['elementId'].firstChange;

    if (!this.chart || elementIdChanged) {
      this.chart?.destroy();
      this.chart = this.chartService.createChart(this.elementId, 'line', this.labels, this.data);
      return;
    }

    this.chart.data.labels = [...this.labels] as unknown as string[];
    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].data = [...this.data];
    }
    this.chart.update();
  }
}
