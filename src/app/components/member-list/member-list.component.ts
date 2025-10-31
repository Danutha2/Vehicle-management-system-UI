import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent {
  vehicles = signal<any[]>([]);
  total = signal(0);
  page = signal(1);
  pageSize = signal(100); // <-- changed to signal
  searchText = signal('');
  
  // Changed from editingId → editingVin
  editingVin = signal<string | null>(null);
  editData = signal<any>({});

  constructor(private vehicleService: VehicleService) {
    this.loadVehicles();
  }

  trackById(index: number, item: any): any {
    return item.id;
  }

  loadVehicles() {
    this.vehicleService
      .getPaginatedVehicles(this.page(), this.pageSize())
      .subscribe((res) => {
        this.vehicles.set(res.data);
        this.total.set(res.total);
      });
  }

  onSearchTextChange(value: string) {
    this.searchText.set(value);
  }

  searchVehicles() {
    const keyword = this.searchText().trim();
    if (!keyword) {
      this.loadVehicles();
      return;
    }

    this.vehicleService.searchVehicle(keyword).subscribe((res) => {
      this.vehicles.set(res);
    });
  }

  startEdit(vehicle: any) {
    this.editingVin.set(vehicle.vin);
    this.editData.set({ ...vehicle });
  }

  updateEditField(field: string, value: string) {
    this.editData.set({ ...this.editData(), [field]: value });
  }

  saveEdit() {
    const updateData = this.editData();
    if (!updateData.vin) {
      alert('VIN is required to update vehicle!');
      return;
    }

    console.log('=== UPDATE DEBUG ===');
    console.log('VIN:', updateData.vin);
    console.log('Full data:', updateData);

    this.vehicleService.updateVehicle(updateData).subscribe({
      next: (result) => {
        console.log('Update success:', result);
        this.editingVin.set(null);
        this.loadVehicles();
      },
      error: (err) => {
        console.error('=== UPDATE ERROR ===', err);
        alert('Update failed! Check console for details.');
      },
    });
  }

  cancelEdit() {
    this.editingVin.set(null);
    this.editData.set({});
  }

  deleteVehicle(id: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: (result) => {
          console.log('Delete success:', result);
          this.loadVehicles();
        },
        error: (err) => {
          console.error('=== DELETE ERROR ===', err);
          alert('Delete failed! Check console for details.');
        },
      });
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadVehicles();
    }
  }

  nextPage() {
    if (this.page() * this.pageSize() < this.total()) {
      this.page.update((p) => p + 1);
      this.loadVehicles();
    }
  }

  // --- New method for pageSize input ---
  onPageSizeChange(value: string) {
    const size = Number(value);
    if (!isNaN(size) && size > 0) {
      this.pageSize.set(size);
      this.page.set(1); // reset to first page
      this.loadVehicles();
    }
  }
}
