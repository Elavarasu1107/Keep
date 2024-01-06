import { TestBed } from '@angular/core/testing';

import { SideNavTogglerService } from './side-nav-toggler.service';

describe('SideNavTogglerService', () => {
  let service: SideNavTogglerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideNavTogglerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
