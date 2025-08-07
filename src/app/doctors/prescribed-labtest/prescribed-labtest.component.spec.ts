import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedLabtestComponent } from './prescribed-labtest.component';

describe('PrescribedLabtestComponent', () => {
  let component: PrescribedLabtestComponent;
  let fixture: ComponentFixture<PrescribedLabtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescribedLabtestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescribedLabtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
