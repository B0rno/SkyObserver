import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAstre } from './map-astre';

describe('MapAstre', () => {
  let component: MapAstre;
  let fixture: ComponentFixture<MapAstre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapAstre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapAstre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
