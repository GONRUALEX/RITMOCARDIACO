import { TestBed } from '@angular/core/testing';

import { AuthNotGuardService } from './auth-not-guard.service';

describe('AuthNotGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthNotGuardService = TestBed.get(AuthNotGuardService);
    expect(service).toBeTruthy();
  });
});
