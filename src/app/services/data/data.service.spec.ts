import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Country } from '../../models/country.model';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch countries from the JSON file', () => {
    const mock: Country[] = [
      { id: 1, country: 'Test', participations: [] }
    ];

    service.getCountries().subscribe((data) => {
      expect(data).toEqual(mock);
    });

    const req = httpMock.expectOne('./assets/mock/olympic.json');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});