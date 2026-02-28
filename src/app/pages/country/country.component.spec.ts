import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CountryComponent } from "./country.component";
import { DataService } from '../../services/data/data.service';
import { Country } from '../../models/country.model';

describe('DetailComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  let dataServiceSpy: jasmine.SpyObj<DataService>;
  const mockCountries: Country[] = [
    { id: 1, country: 'France', participations: [{ id: 1, year: 2000, city: 'Paris', medalsCount: 1, athleteCount: 2 }] },
    { id: 2, country: 'Spain', participations: [{ id: 2, year: 2000, city: 'Madrid', medalsCount: 0, athleteCount: 1 }] }
  ];

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getCountries']);
    dataServiceSpy.getCountries.and.returnValue(of(mockCountries));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ CountryComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 'France' }) } },
        { provide: DataService, useValue: dataServiceSpy }
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

  it('should load the correct country and compute totals', () => {
    expect(component.titlePage).toBe('France');
    expect(component.totalMedals).toBe(1);
    expect(component.lineChart).toBeDefined();
  });
});
