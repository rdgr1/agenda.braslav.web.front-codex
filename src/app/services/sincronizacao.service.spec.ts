import { TestBed } from '@angular/core/testing';

import { SincronizacaoService } from './sincronizacao.service';

describe('SincronizacaoService', () => {
  let service: SincronizacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SincronizacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
