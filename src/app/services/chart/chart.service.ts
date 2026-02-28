import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';
import type { Chart as ChartType, ChartConfiguration, ChartDataset } from 'chart.js';
import { CHART_CONFIG } from '../../core/config';

export type ChartKind = 'pie' | 'line';

export interface ChartOptions {
  onDatasetClick?: (index: number, labels: (string | number)[], chart: ChartType) => void;
  hoverOffset?: number;
}

@Injectable({ providedIn: 'root' })
export class ChartService {
  createChart(
    elementId: string,
    kind: ChartKind,
    labels: (string | number)[],
    data: number[],
    chartOptions?: ChartConfiguration<'pie' | 'line', number[], string>['options'],
    advancedOptions?: ChartOptions
  ): ChartType {
    const dataset: ChartDataset<'pie' | 'line', number[]> = {
      label: kind === 'pie' ? 'Medals' : 'medals',
      data,
      backgroundColor:
        kind === 'pie' ? CHART_CONFIG.colors : CHART_CONFIG.colors[0],
      ...(kind === 'pie' && advancedOptions?.hoverOffset && { hoverOffset: advancedOptions.hoverOffset }),
    };

    const cfg: ChartConfiguration<'pie' | 'line', number[], string> = {
      type: kind,
      data: {
        labels: labels as string[],
        datasets: [dataset],
      },
      options: {
        ...chartOptions,
        aspectRatio: chartOptions?.aspectRatio ?? 2.5,
      },
    };

    const chart = new Chart(elementId, cfg) as ChartType;

    // Attach click handler after chart creation 
    if (advancedOptions?.onDatasetClick) {
      const canvasElement = document.getElementById(elementId) as HTMLCanvasElement | null;
      if (canvasElement) {
        canvasElement.addEventListener('click', (event: Event) => {
          const elements = chart.getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            true
          );
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            advancedOptions.onDatasetClick?.(index, labels, chart);
          }
        });
      }
    }

    return chart;
  }
}

