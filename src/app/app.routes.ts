import { Routes } from '@angular/router';
import { ImportVehicleComponent } from './components/import-vehicle/import-vehicle.component';
import { ExportVehicleComponent } from './components/export-vehicle/export-vehicle.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { VehicleRecordDetailsComponent } from './components/vehicle-record-details/vehicle-record-details.component';
import { NotificationComponent } from './components/notification/notification.component';
import { EmailCollectorComponent } from './components/email-collector/email-collector.component';
import { ManageServiceRecordsComponent } from './components/manage-service-records/manage-service-records.component'; // ✅ New import

export const routes: Routes = [
  { path: '', redirectTo: 'import-vehicle', pathMatch: 'full' },
  { path: 'import-vehicle', component: ImportVehicleComponent },
  { path: 'export-vehicle', component: ExportVehicleComponent },
  { path: 'member-list', component: MemberListComponent },
  { path: 'vehicle-records', component: VehicleRecordDetailsComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'email-collector', component: EmailCollectorComponent },
  { path: 'manage-service-records', component: ManageServiceRecordsComponent },
];
