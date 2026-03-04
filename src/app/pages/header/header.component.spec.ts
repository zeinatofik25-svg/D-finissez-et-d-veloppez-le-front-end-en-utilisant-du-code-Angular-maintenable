import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent, HeaderIndicator } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.title = 'Title';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    component.title = 'Medals per Country';
    fixture.detectChanges();

    const titleEl: HTMLElement | null = fixture.nativeElement.querySelector('.center div');
    expect(titleEl?.textContent?.trim()).toBe('Medals per Country');
  });

  it('should render indicators when provided', () => {
    component.title = 'Title';
    const indicators: HeaderIndicator[] = [
      { label: 'Countries', value: 10 },
      { label: 'JOs', value: 5 },
    ];
    component.indicators = indicators;
    fixture.detectChanges();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.split > div');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Countries');
    expect(items[0].textContent).toContain('10');
    expect(items[1].textContent).toContain('JOs');
    expect(items[1].textContent).toContain('5');
  });

  it('should not render indicators container when list is empty', () => {
    component.title = 'Title';
    component.indicators = [];
    fixture.detectChanges();

    const split: HTMLElement | null = fixture.nativeElement.querySelector('.split');
    expect(split).toBeNull();
  });
});
