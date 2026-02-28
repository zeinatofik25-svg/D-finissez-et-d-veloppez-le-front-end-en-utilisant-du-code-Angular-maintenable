import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { OlympicStatistics, StatisticsService } from '../../services/statistics/statistics.service';
import { ErrorService } from '../../services/error/error.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-pie-chart',
  template: '',
})
class PieChartStubComponent {
  @Input() elementId = '';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() enableNavigation = false;
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  const mockCountries: Country[] = [
    { id: 1, country: 'Country A', participations: [{ id: 1, year: 2000, city: 'City A', medalsCount: 5, athleteCount: 10 }] },
    { id: 2, country: 'Country B', participations: [{ id: 2, year: 2000, city: 'City B', medalsCount: 7, athleteCount: 8 }] }
  ];

  const mockOlympicStats: OlympicStatistics = {
    countries: mockCountries,
    totalCountries: 2,
    totalJOs: 1,
    countryLabels: ['Country A', 'Country B'],
    medalsByCountry: [5, 7]
  };

  beforeEach(async () => {
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getGlobalStatistics']);
    statisticsServiceSpy.getGlobalStatistics.and.returnValue(of(mockOlympicStats));
    
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent, PieChartStubComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats after initialization', (done) => {
    setTimeout(() => {
      expect(component.stats).toBeDefined();
      expect(component.stats?.totalCountries).toBe(2);
      expect(component.stats?.totalJOs).toBe(1);
      done();
    }, 100);
  });
});

