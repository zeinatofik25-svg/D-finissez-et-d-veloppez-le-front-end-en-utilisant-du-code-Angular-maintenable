import { TestBed } from '@angular/core/testing';
import { ChartService } from './chart.service';
import Chart from 'chart.js/auto';

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartService]
    });
    service = TestBed.inject(ChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a pie chart instance', () => {
    // create a dummy canvas element to attach chart
    const canvas = document.createElement('canvas');
    canvas.id = 'testChart';
    document.body.appendChild(canvas);

    const chart = service.createChart('testChart', 'pie', ['a'], [1]);
    expect(chart).toBeInstanceOf(Chart);

    chart.destroy();
    document.body.removeChild(canvas);
  });
});