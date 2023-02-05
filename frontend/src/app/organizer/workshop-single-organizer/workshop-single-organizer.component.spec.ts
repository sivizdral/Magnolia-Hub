import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopSingleOrganizerComponent } from './workshop-single-organizer.component';

describe('WorkshopSingleOrganizerComponent', () => {
  let component: WorkshopSingleOrganizerComponent;
  let fixture: ComponentFixture<WorkshopSingleOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopSingleOrganizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopSingleOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
