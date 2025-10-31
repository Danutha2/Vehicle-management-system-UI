import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportVehicleComponent } from './export-vehicle.component';

describe('ExportVehicleComponent', () => {
  let component: ExportVehicleComponent;
  let fixture: ComponentFixture<ExportVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
