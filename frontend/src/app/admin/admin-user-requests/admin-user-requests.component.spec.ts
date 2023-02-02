import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserRequestsComponent } from './admin-user-requests.component';

describe('AdminUserRequestsComponent', () => {
  let component: AdminUserRequestsComponent;
  let fixture: ComponentFixture<AdminUserRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
