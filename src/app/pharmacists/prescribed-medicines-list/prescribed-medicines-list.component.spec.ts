import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedMedicinesListComponent } from './prescribed-medicines-list.component';

describe('PrescribedMedicinesListComponent', () => {
  let component: PrescribedMedicinesListComponent;
  let fixture: ComponentFixture<PrescribedMedicinesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescribedMedicinesListComponent ]
    })
    .compileComponents();
    

    fixture = TestBed.createComponent(PrescribedMedicinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
