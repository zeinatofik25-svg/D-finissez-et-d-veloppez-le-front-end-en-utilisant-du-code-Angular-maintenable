import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { Country } from '../../models/country.model';

/**
 * Domaine service : encapsule toute la logique métier
 * calcul des statistiques, totaux, transformations des données olympiques
 */
export interface OlympicStatistics {
  countries: Country[];
  totalCountries: number;
  totalJOs: number;
  countryLabels: string[];
  medalsByCountry: number[];
}

export interface CountryStatistics {
  country: Country;
  years: number[];
  medalsByYear: number[];
  totalMedals: number;
  totalAthletes: number;
}

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(private dataService: DataService) {}

  /**
   * Retourne les statistiques olympiques globales (dashboard)
   */
  getGlobalStatistics(): Observable<OlympicStatistics> {
    return this.dataService.getCountries().pipe(
      map((countries) => {
        const totalCountries = countries.length;
        const uniqueYears = new Set(
          countries.flatMap((c) => c.participations.map((p) => p.year))
        );
        const totalJOs = uniqueYears.size;

        const countryLabels = countries.map((c) => c.country);
        const medalsByCountry = countries.map((c) =>
          c.participations.reduce((acc, p) => acc + p.medalsCount, 0)
        );

        return {
          countries,
          totalCountries,
          totalJOs,
          countryLabels,
          medalsByCountry,
        };
      })
    );
  }

  /**
   * Retourne les statistiques pour un pays spécifique
   */
  getCountryStatistics(countryName: string): Observable<CountryStatistics> {
    return this.dataService.getCountries().pipe(
      map((countries) => {
        const country = countries.find((c) => c.country === countryName);
        if (!country) {
          throw new Error(`Country ${countryName} not found`);
        }

        const participations = country.participations ?? [];
        const years = participations.map((p) => p.year);
        const medalsByYear = participations.map((p) => p.medalsCount);
        const totalMedals = medalsByYear.reduce((acc, m) => acc + m, 0);
        const totalAthletes = participations.reduce(
          (acc, p) => acc + p.athleteCount,
          0
        );

        return {
          country,
          years,
          medalsByYear,
          totalMedals,
          totalAthletes,
        };
      })
    );
  }
}
