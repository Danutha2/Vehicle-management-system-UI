import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NotificationService, AppNotification } from '../../services/notification.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-export-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './export-vehicle.component.html',
  styleUrls: ['./export-vehicle.component.css']
})
export class ExportVehicleComponent implements OnInit, OnDestroy {
  exportForm!: FormGroup;
  isSubmitting = false;
  email: string = '';

  private emailSub!: Subscription;
  private notificationSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.email = this.userService.getEmails()[0] || '';
    this.exportForm = new FormGroup({
      minAge: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }

  ngOnInit() {
    // Listen for email changes
    this.emailSub = this.userService.emails$.subscribe(emails => {
      this.email = emails.length ? emails[emails.length - 1] : '';
    });

    // Subscribe to notifications
    this.notificationSub = this.notificationService.notifications$.subscribe((messages: AppNotification[]) => {
      messages.forEach(msg => {
        if (msg.fileName) {
          this.downloadFile(msg.fileName);
        }
      });
    });
  }

  ngOnDestroy() {
    this.emailSub?.unsubscribe();
    this.notificationSub?.unsubscribe();
  }

  exportVehicles(): void {
    if (this.exportForm.invalid || !this.email) {
      alert('Please enter a valid email and form data');
      return;
    }

    this.isSubmitting = true;
    const payload = { ...this.exportForm.value, email: this.email };

    this.http.post('http://localhost:3001/vehicle-service/export', payload).subscribe({
      next: () => {
        // Backend will send notification with fileName if export is ready
        this.isSubmitting = false;
      },
      error: (err) => {
        this.notificationService.pushLocalNotification(`❌ Export failed: ${err.message}`, 'error');
        this.isSubmitting = false;
      },
    });
  }

  downloadFile(fileName: string) {
    const downloadUrl = `http://localhost:3001/vehicle-service/download?fileName=${fileName}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`⬇️ Download triggered for file: ${fileName}`);
  }
}
