import { TestBed } from '@angular/core/testing';

import { ImageNasa } from './image-nasa';

describe('ImageNasa', () => {
  let service: ImageNasa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageNasa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
