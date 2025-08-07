import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestViewComponent } from './labtest-view.component';

describe('LabtestViewComponent', () => {
  let component: LabtestViewComponent;
  let fixture: ComponentFixture<LabtestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabtestViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabtestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
