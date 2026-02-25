import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      map((data) => data ?? [])
    );
  }
}
