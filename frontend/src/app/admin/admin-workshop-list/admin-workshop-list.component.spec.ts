import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWorkshopListComponent } from './admin-workshop-list.component';

describe('AdminWorkshopListComponent', () => {
  let component: AdminWorkshopListComponent;
  let fixture: ComponentFixture<AdminWorkshopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWorkshopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWorkshopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
