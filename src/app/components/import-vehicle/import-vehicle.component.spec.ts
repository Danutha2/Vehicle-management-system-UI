import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportVehicleComponent } from './import-vehicle.component';

describe('ImportVehicleComponent', () => {
  let component: ImportVehicleComponent;
  let fixture: ComponentFixture<ImportVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
