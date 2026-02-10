import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapActualite } from './map-actualite';

describe('MapActualite', () => {
  let component: MapActualite;
  let fixture: ComponentFixture<MapActualite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapActualite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapActualite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
