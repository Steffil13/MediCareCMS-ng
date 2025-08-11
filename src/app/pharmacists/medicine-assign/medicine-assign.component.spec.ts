import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineAssignComponent } from './medicine-assign.component';

describe('MedicineAssignComponent', () => {
  let component: MedicineAssignComponent;
  let fixture: ComponentFixture<MedicineAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineAssignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
