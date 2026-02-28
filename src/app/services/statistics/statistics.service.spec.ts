/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { StatisticsService } from './statistics.service';
import { DataService } from '../data/data.service';
import { Country } from '../../models/country.model';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  const mockCountries: Country[] = [
    {
      id: 1,
      country: 'France',
      participations: [
        { id: 1, year: 2012, city: 'London', medalsCount: 10, athleteCount: 100 },
        { id: 2, year: 2016, city: 'Rio', medalsCount: 12, athleteCount: 110 },
      ],
    },
    {
      id: 2,
      country: 'Italy',
      participations: [
        { id: 1, year: 2012, city: 'London', medalsCount: 8, athleteCount: 90 },
        { id: 2, year: 2020, city: 'Tokyo', medalsCount: 15, athleteCount: 120 },
      ],
    },
  ];

  beforeEach(() => {
    dataServiceSpy = jasmine.createSpyObj<DataService>('DataService', ['getCountries']);

    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        { provide: DataService, useValue: dataServiceSpy },
      ],
    });

    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute global statistics (totals + medals by country)', async () => {
    dataServiceSpy.getCountries.and.returnValue(of(mockCountries));

    const stats = await firstValueFrom(service.getGlobalStatistics());

    expect(stats.countries).toEqual(mockCountries);
    expect(stats.totalCountries).toBe(2);

    // Unique Olympic years across all participations: 2012, 2016, 2020
    expect(stats.totalJOs).toBe(3);

    expect(stats.countryLabels).toEqual(['France', 'Italy']);
    expect(stats.medalsByCountry).toEqual([22, 23]);
  });

  it('should compute country statistics for a given country', async () => {
    dataServiceSpy.getCountries.and.returnValue(of(mockCountries));

    const stats = await firstValueFrom(service.getCountryStatistics('France'));

    expect(stats.country.country).toBe('France');
    expect(stats.years).toEqual([2012, 2016]);
    expect(stats.medalsByYear).toEqual([10, 12]);
    expect(stats.totalMedals).toBe(22);
    expect(stats.totalAthletes).toBe(210);
  });

  it('should error when country is not found', async () => {
    dataServiceSpy.getCountries.and.returnValue(of(mockCountries));

    await expectAsync(
      firstValueFrom(service.getCountryStatistics('Germany'))
    ).toBeRejectedWithError(/Country Germany not found/);
  });
});
