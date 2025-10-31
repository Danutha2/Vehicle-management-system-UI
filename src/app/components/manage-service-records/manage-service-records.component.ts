import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleRecordService } from '../../services/vehicleRecordService';

@Component({
  selector: 'app-manage-service-records',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './manage-service-records.component.html',
  styleUrl: './manage-service-records.component.css'
})
export class ManageServiceRecordsComponent {
   records: any[] = [];
  vehicles: any[] = [];
  filteredRecords: any[] = [];
  
  // Filter properties
  filterVIN = '';
  filterDateFrom = '';
  filterDateTo = '';
  
  // Modal state
  showModal = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  currentRecord: any = this.getEmptyRecord();
  
  // Validation
  errors: any = {};
  isSubmitting = false;

  constructor(private vehicleService: VehicleRecordService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load all vehicles for dropdown
    this.vehicleService.getAllVehicles().subscribe(
      vehicles => {
        this.vehicles = vehicles;
        console.log('Vehicles loaded:', vehicles);
      },
      error => console.error('Error loading vehicles:', error)
    );

    // Load all records
    this.loadRecords();
  }

  loadRecords() {
    this.vehicleService.getAllRecords().subscribe(
      (res: any) => {
        this.records = res.data.vehicleRecords || [];
        this.filteredRecords = [...this.records];
        console.log('Records loaded:', this.records);
      },
      error => console.error('Error loading records:', error)
    );
  }

  getEmptyRecord() {
    return {
      id: null,
      vin: '',
      date: '',
      description: '',
      performed_by: ''
    };
  }

  // CRUD Operations

  openCreateModal() {
    this.modalMode = 'create';
    this.currentRecord = this.getEmptyRecord();
    this.errors = {};
    this.showModal = true;
  }

  openEditModal(record: any) {
    this.modalMode = 'edit';
    this.currentRecord = { ...record };
    this.errors = {};
    this.showModal = true;
  }

  openViewModal(record: any) {
    this.modalMode = 'view';
    this.currentRecord = { ...record };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentRecord = this.getEmptyRecord();
    this.errors = {};
  }

  validateRecord(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.currentRecord.vin || !this.currentRecord.vin.trim()) {
      this.errors.vin = 'VIN is required';
      isValid = false;
    } else {
      // Check if VIN exists in vehicles list
      const vehicleExists = this.vehicles.some(v => v.vin === this.currentRecord.vin);
      if (!vehicleExists) {
        this.errors.vin = 'VIN does not exist. Please select a valid vehicle.';
        isValid = false;
      }
    }

    if (!this.currentRecord.date) {
      this.errors.date = 'Date is required';
      isValid = false;
    }

    if (!this.currentRecord.description || !this.currentRecord.description.trim()) {
      this.errors.description = 'Description is required';
      isValid = false;
    }

    if (!this.currentRecord.performed_by || !this.currentRecord.performed_by.trim()) {
      this.errors.performed_by = 'Performed by is required';
      isValid = false;
    }

    return isValid;
  }

  saveRecord() {
    if (!this.validateRecord()) {
      return;
    }

    this.isSubmitting = true;

    if (this.modalMode === 'create') {
      this.createRecord();
    } else if (this.modalMode === 'edit') {
      this.updateRecord();
    }
  }

  createRecord() {
    const input = {
      vin: this.currentRecord.vin,
      date: this.currentRecord.date,
      description: this.currentRecord.description,
      performed_by: this.currentRecord.performed_by
    };

    this.vehicleService.createRecord(input).subscribe(
      (res: any) => {
        console.log('Record created:', res);
        alert('✅ Service record created successfully!');
        this.loadRecords();
        this.closeModal();
        this.isSubmitting = false;
      },
      error => {
        console.error('Error creating record:', error);
        alert('❌ Error creating record. Please try again.');
        this.isSubmitting = false;
      }
    );
  }

  updateRecord() {
    const input = {
      id: this.currentRecord.id,
      vin: this.currentRecord.vin,
      date: this.currentRecord.date,
      description: this.currentRecord.description,
      performed_by: this.currentRecord.performed_by
    };

    this.vehicleService.updateRecord(input).subscribe(
      (res: any) => {
        console.log('Record updated:', res);
        alert('✅ Service record updated successfully!');
        this.loadRecords();
        this.closeModal();
        this.isSubmitting = false;
      },
      error => {
        console.error('Error updating record:', error);
        alert('❌ Error updating record. Please try again.');
        this.isSubmitting = false;
      }
    );
  }

  deleteRecord(record: any) {
    if (!confirm(`Are you sure you want to delete this service record?\n\nVIN: ${record.vin}\nDate: ${record.date}\nDescription: ${record.description}`)) {
      return;
    }

    this.vehicleService.deleteRecord(record.id).subscribe(
      (res: any) => {
        console.log('Record deleted:', res);
        alert('✅ Service record deleted successfully!');
        this.loadRecords();
      },
      error => {
        console.error('Error deleting record:', error);
        alert('❌ Error deleting record. Please try again.');
      }
    );
  }

  // Filter functionality

  applyFilters() {
    this.filteredRecords = this.records.filter(record => {
      let matches = true;

      // Filter by VIN
      if (this.filterVIN && this.filterVIN.trim()) {
        matches = matches && record.vin.toLowerCase().includes(this.filterVIN.toLowerCase());
      }

      // Filter by date range
      if (this.filterDateFrom) {
        matches = matches && record.date >= this.filterDateFrom;
      }

      if (this.filterDateTo) {
        matches = matches && record.date <= this.filterDateTo;
      }

      return matches;
    });
  }

  clearFilters() {
    this.filterVIN = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filteredRecords = [...this.records];
  }

  // Helper methods

  getVehicleInfo(vin: string): any {
    return this.vehicles.find(v => v.vin === vin);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
