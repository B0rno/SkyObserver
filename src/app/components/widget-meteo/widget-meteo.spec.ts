import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMeteo } from './widget-meteo';

describe('WidgetMeteo', () => {
  let component: WidgetMeteo;
  let fixture: ComponentFixture<WidgetMeteo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetMeteo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetMeteo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
