import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServiceRecordsComponent } from './manage-service-records.component';

describe('ManageServiceRecordsComponent', () => {
  let component: ManageServiceRecordsComponent;
  let fixture: ComponentFixture<ManageServiceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageServiceRecordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageServiceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
