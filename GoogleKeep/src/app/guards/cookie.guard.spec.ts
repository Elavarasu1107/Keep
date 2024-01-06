import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cookieGuard } from './cookie.guard';

describe('cookieGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cookieGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
