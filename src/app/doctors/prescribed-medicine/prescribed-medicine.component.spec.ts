import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedMedicineComponent } from './prescribed-medicine.component';

describe('PrescribedMedicineComponent', () => {
  let component: PrescribedMedicineComponent;
  let fixture: ComponentFixture<PrescribedMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescribedMedicineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescribedMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
