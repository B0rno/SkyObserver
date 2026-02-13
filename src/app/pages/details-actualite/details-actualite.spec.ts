import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsActualite } from './details-actualite';

describe('DetailsActualite', () => {
  let component: DetailsActualite;
  let fixture: ComponentFixture<DetailsActualite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsActualite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsActualite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
