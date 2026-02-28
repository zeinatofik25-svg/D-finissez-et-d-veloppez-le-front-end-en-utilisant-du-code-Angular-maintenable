import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CountryComponent } from "./country.component";
import { StatisticsService } from '../../services/statistics/statistics.service';
import { ErrorService } from '../../services/error/error.service';
import { Country } from '../../models/country.model';
import { LineChartComponent } from '../../components/charts/line-chart/line-chart.component';

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
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ CountryComponent, LineChartComponent ],
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

