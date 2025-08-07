import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestResultComponent } from './update-lab-result.component';

describe('UpdateLabResultComponent', () => {
  let component: UpdateTestResultComponent;
  let fixture: ComponentFixture<UpdateTestResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTestResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTestResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
