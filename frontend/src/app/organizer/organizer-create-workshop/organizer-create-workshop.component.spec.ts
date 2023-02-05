import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerCreateWorkshopComponent } from './organizer-create-workshop.component';

describe('OrganizerCreateWorkshopComponent', () => {
  let component: OrganizerCreateWorkshopComponent;
  let fixture: ComponentFixture<OrganizerCreateWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerCreateWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerCreateWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
