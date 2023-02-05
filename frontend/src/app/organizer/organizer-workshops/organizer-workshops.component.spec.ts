import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerWorkshopsComponent } from './organizer-workshops.component';

describe('OrganizerWorkshopsComponent', () => {
  let component: OrganizerWorkshopsComponent;
  let fixture: ComponentFixture<OrganizerWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerWorkshopsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
