import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkshopComponent } from './update-workshop.component';

describe('UpdateWorkshopComponent', () => {
  let component: UpdateWorkshopComponent;
  let fixture: ComponentFixture<UpdateWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateWorkshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
