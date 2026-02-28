import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';

import { CountryComponent } from "./country.component";
import { StatisticsService } from '../../services/statistics/statistics.service';
import { ErrorService } from '../../services/error/error.service';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-line-chart',
  template: '',
})
class LineChartStubComponent {
  @Input() elementId = '';
  @Input() labels: Array<string | number> = [];
  @Input() data: number[] = [];
}

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  let statisticsServiceSpy: jasmine.SpyObj<StatisticsService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  
  const mockCountry: Country = {
    id: 1,
    country: 'France',
    participations: [
      { id: 1, year: 2000, city: 'Paris', medalsCount: 1, athleteCount: 2 }
    ]
  };

  beforeEach(async () => {
    statisticsServiceSpy = jasmine.createSpyObj('StatisticsService', ['getCountryStatistics']);
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);
    
    statisticsServiceSpy.getCountryStatistics.and.returnValue(of({
      country: mockCountry,
      years: [2000],
      medalsByYear: [1],
      totalMedals: 1,
      totalAthletes: 2
    }));

    await TestBed.configureTestingModule({
      declarations: [CountryComponent, LineChartStubComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: (key: string) => key === 'countryName' ? 'France' : null }) } },
        { provide: StatisticsService, useValue: statisticsServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct country stats', (done) => {
    setTimeout(() => {
      expect(component.countryStats).toBeDefined();
      expect(component.countryStats?.country.country).toBe('France');
      expect(component.countryStats?.totalMedals).toBe(1);
      done();
    }, 100);
  });
});

