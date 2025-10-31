import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleRecordService } from '../../services/vehicleRecordService';

@Component({
  selector: 'vehicle-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-record-details.component.html',
})
export class VehicleRecordDetailsComponent implements OnInit {
  vehicles: any[] = [];
  vehicleInfo: any = null;
  serviceRecords: any[] = [];

  searchVIN = '';
  selectedVIN = '';
  vehicleFields: string[] = ['vin', 'car_make', 'car_model', 'first_name', 'last_name', 'email', 'manufactured_date', 'age_of_vehicle'];
  recordFields: string[] = ['id', 'date', 'description', 'performed_by'];
  selectedVehicleFields: string[] = [];
  selectedRecordFields: string[] = [];

  // New state management properties
  isFieldSelectionLocked = false;
  showFieldSelection = false;
  isDataLoaded = false;

  constructor(private vehicleService: VehicleRecordService) {}

  ngOnInit() {
    console.log('VehicleRecordDetailsComponent initialized');
    this.loadVehicles();
    this.resetFieldSelection();
  }

  loadVehicles() {
    console.log('Loading all vehicles...');
    this.vehicleService.getAllVehicles().subscribe(
      res => {
        this.vehicles = res;
        console.log('Vehicles loaded:', this.vehicles);
      },
      error => console.error('Error loading vehicles:', error)
    );
  }

  searchByVIN() {
    if (!this.searchVIN || !this.searchVIN.trim()) {
      alert('⚠ Please enter a VIN to search.');
      return;
    }
    
    console.log('Searching for vehicle with VIN:', this.searchVIN);

    // Reset dropdown selection when doing VIN search
    this.selectedVIN = '';
    this.resetFieldSelection();

    // Fetch ALL fields for direct VIN search
    this.vehicleService.getVehicleByVIN(this.searchVIN.trim()).subscribe(
      vehicle => {
        this.vehicleInfo = vehicle;
        this.serviceRecords = vehicle.serviceRecord || [];
        // Set all fields as selected to display everything
        this.selectedVehicleFields = [...this.vehicleFields];
        this.selectedRecordFields = [...this.recordFields];
        this.isDataLoaded = true;
        this.showFieldSelection = false;
        console.log('Vehicle info loaded:', this.vehicleInfo);
        console.log('Service records loaded:', this.serviceRecords);
      },
      error => {
        console.error('Error fetching vehicle by VIN:', error);
        alert('❌ Error: Vehicle not found or failed to load.');
        this.clearData();
      }
    );
  }

  onVehicleDropdownChange() {
    if (!this.selectedVIN) {
      this.clearData();
      this.resetFieldSelection();
      return;
    }

    console.log('Selected VIN from dropdown:', this.selectedVIN);
    
    // Clear previous data and show field selection
    this.vehicleInfo = null;
    this.serviceRecords = [];
    this.isDataLoaded = false;
    this.showFieldSelection = true;
    this.isFieldSelectionLocked = false;
    
    // Reset search VIN input
    this.searchVIN = '';
  }

  loadSelectedData() {
    if (!this.selectedVIN) return;

    // Validate field selection
    if (!this.selectedVehicleFields.length || !this.selectedRecordFields.length) {
      alert('⚠ Please select at least one Vehicle field and one Service Record field.');
      return;
    }

    console.log('Loading data with selected fields...');
    console.log('Selected vehicle fields:', this.selectedVehicleFields);
    console.log('Selected record fields:', this.selectedRecordFields);

    // Fetch only selected fields dynamically
    this.vehicleService.getVehicleWithSelectedFields(
      this.selectedVIN,
      this.selectedVehicleFields,
      this.selectedRecordFields
    ).subscribe(
      vehicle => {
        this.vehicleInfo = vehicle;
        this.serviceRecords = vehicle.serviceRecord || [];
        this.isDataLoaded = true;
        this.isFieldSelectionLocked = true; // Lock the field selection
        console.log('Vehicle info (dynamic fields) loaded:', this.vehicleInfo);
        console.log('Service records (dynamic fields) loaded:', this.serviceRecords);
      },
      error => {
        console.error('Error fetching vehicle with selected fields:', error);
        alert('❌ Error: Failed to load vehicle data.');
      }
    );
  }

  resetFieldSelection() {
    this.selectedVehicleFields = [];
    this.selectedRecordFields = [];
    this.isFieldSelectionLocked = false;
    this.showFieldSelection = false;
    this.isDataLoaded = false;
  }

  resetSelection() {
    this.selectedVIN = '';
    this.searchVIN = '';
    this.clearData();
    this.resetFieldSelection();
  }

  clearData() {
    this.vehicleInfo = null;
    this.serviceRecords = [];
    this.isDataLoaded = false;
  }

  toggleVehicleField(field: string) {
    if (this.isFieldSelectionLocked) return; // Prevent changes when locked

    const idx = this.selectedVehicleFields.indexOf(field);
    if (idx > -1) {
      this.selectedVehicleFields.splice(idx, 1);
      console.log(`Removed vehicle field: ${field}`);
    } else {
      this.selectedVehicleFields.push(field);
      console.log(`Added vehicle field: ${field}`);
    }
  }

  toggleRecordField(field: string) {
    if (this.isFieldSelectionLocked) return; // Prevent changes when locked

    const idx = this.selectedRecordFields.indexOf(field);
    if (idx > -1) {
      this.selectedRecordFields.splice(idx, 1);
      console.log(`Removed record field: ${field}`);
    } else {
      this.selectedRecordFields.push(field);
      console.log(`Added record field: ${field}`);
    }
  }

  selectAllVehicleFields() {
    if (this.isFieldSelectionLocked) return;
    this.selectedVehicleFields = [...this.vehicleFields];
  }

  clearAllVehicleFields() {
    if (this.isFieldSelectionLocked) return;
    this.selectedVehicleFields = [];
  }

  selectAllRecordFields() {
    if (this.isFieldSelectionLocked) return;
    this.selectedRecordFields = [...this.recordFields];
  }

  clearAllRecordFields() {
    if (this.isFieldSelectionLocked) return;
    this.selectedRecordFields = [];
  }

  getLabel(field: string): string {
    const labels: any = {
      vin: 'VIN', 
      car_make: 'Make', 
      car_model: 'Model',
      first_name: 'Owner First Name', 
      last_name: 'Owner Last Name',
      email: 'Email', 
      manufactured_date: 'Manufactured Date', 
      age_of_vehicle: 'Vehicle Age',
      id: 'Record ID', 
      date: 'Service Date', 
      description: 'Description', 
      performed_by: 'Performed By'
    };
    return labels[field] || field;
  }
}