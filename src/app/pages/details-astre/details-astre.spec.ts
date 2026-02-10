import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAstre } from './details-astre';

describe('DetailsAstre', () => {
  let component: DetailsAstre;
  let fixture: ComponentFixture<DetailsAstre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAstre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAstre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
