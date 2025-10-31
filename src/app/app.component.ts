import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ImportVehicleComponent } from './components/import-vehicle/import-vehicle.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ExportVehicleComponent } from './components/export-vehicle/export-vehicle.component';
import { VehicleRecordDetailsComponent } from './components/vehicle-record-details/vehicle-record-details.component';
import { EmailCollectorComponent } from './components/email-collector/email-collector.component';
import { ManageServiceRecordsComponent } from './components/manage-service-records/manage-service-records.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, // just RouterModule here
    RouterOutlet,
    ImportVehicleComponent,
    MemberListComponent,
    NotificationComponent,
    ExportVehicleComponent,
    VehicleRecordDetailsComponent,
    EmailCollectorComponent,
    ManageServiceRecordsComponent
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}
