import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetesVisibles } from './planetes-visibles';

describe('PlanetesVisibles', () => {
  let component: PlanetesVisibles;
  let fixture: ComponentFixture<PlanetesVisibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetesVisibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetesVisibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
