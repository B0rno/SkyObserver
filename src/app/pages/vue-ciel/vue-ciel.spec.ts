import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VueCiel } from './vue-ciel';

describe('VueCiel', () => {
  let component: VueCiel;
  let fixture: ComponentFixture<VueCiel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VueCiel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VueCiel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
