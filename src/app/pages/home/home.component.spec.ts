import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { DataService } from '../../services/data/data.service';
import { Country } from '../../models/country.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let dataServiceSpy: jasmine.SpyObj<DataService>;
  const mockCountries: Country[] = [
    { id: 1, country: 'A', participations: [{ id: 1, year: 2000, city: 'CityA', medalsCount: 2, athleteCount: 5 }] },
    { id: 2, country: 'B', participations: [{ id: 2, year: 2000, city: 'CityB', medalsCount: 3, athleteCount: 4 }] }
  ];

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getCountries']);
    dataServiceSpy.getCountries.and.returnValue(of(mockCountries));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ HomeComponent ],
      providers: [{ provide: DataService, useValue: dataServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute totals after loading data', () => {
    expect(component.totalCountries).toBe(2);
    expect(component.totalJOs).toBe(1);
    expect(component.pieChart).toBeDefined();
  });
});
