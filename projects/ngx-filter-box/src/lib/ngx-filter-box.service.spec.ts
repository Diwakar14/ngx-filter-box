import { TestBed } from '@angular/core/testing';

import { NgxFilterBoxService } from './ngx-filter-box.service';

describe('NgxFilterBoxService', () => {
  let service: NgxFilterBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFilterBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
