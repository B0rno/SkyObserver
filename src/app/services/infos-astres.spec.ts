import { TestBed } from '@angular/core/testing';

import { InfosAstres } from './infos-astres';

describe('InfosAstres', () => {
  let service: InfosAstres;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfosAstres);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
