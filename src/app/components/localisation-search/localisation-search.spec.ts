import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalisationSearch } from './localisation-search';

describe('LocalisationSearch', () => {
  let component: LocalisationSearch;
  let fixture: ComponentFixture<LocalisationSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalisationSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalisationSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
