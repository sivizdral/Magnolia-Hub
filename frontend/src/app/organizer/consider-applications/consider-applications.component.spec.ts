import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsiderApplicationsComponent } from './consider-applications.component';

describe('ConsiderApplicationsComponent', () => {
  let component: ConsiderApplicationsComponent;
  let fixture: ComponentFixture<ConsiderApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsiderApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsiderApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
