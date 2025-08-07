import { TestBed } from '@angular/core/testing';

import { LabTechnicianService } from './LabTechnician.service';

describe('LabtestService', () => {
  let service: LabTechnicianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabTechnicianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
