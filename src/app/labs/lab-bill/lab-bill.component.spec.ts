import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBillComponent } from './lab-bill.component';

describe('LabBillComponent', () => {
  let component: LabBillComponent;
  let fixture: ComponentFixture<LabBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
