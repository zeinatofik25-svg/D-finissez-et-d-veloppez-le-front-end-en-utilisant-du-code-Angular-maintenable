import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly dataUrl = './assets/mock/olympic.json';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.dataUrl).pipe(
      map((data) => data ?? [])
    );
  }
}
