import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopSingleComponent } from './workshop-single.component';

describe('WorkshopSingleComponent', () => {
  let component: WorkshopSingleComponent;
  let fixture: ComponentFixture<WorkshopSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
