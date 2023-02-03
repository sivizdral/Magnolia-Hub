import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedWorkshopsComponent } from './applied-workshops.component';

describe('AppliedWorkshopsComponent', () => {
  let component: AppliedWorkshopsComponent;
  let fixture: ComponentFixture<AppliedWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedWorkshopsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
