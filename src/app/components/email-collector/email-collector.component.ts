import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-collector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-collector.component.html',
  styleUrls: ['./email-collector.component.css']
})
export class EmailCollectorComponent implements OnInit, OnDestroy {
  email: string = '';
  showModal = false;

  private emailSub!: Subscription;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Show modal if no email exists
    this.showModal = !this.userService.hasEmail();

    // Subscribe to UserService emails array
    this.emailSub = this.userService.emails$.subscribe(emails => {
      if (emails.length) {
        const latestEmail = emails[emails.length - 1];
        // Connect WebSocket if not already connected
        this.notificationService.connect(latestEmail);
        this.showModal = false;
      }
    });
  }

  startConnection(): void {
    if (!this.email.trim()) return;

    // Add email to UserService array
    this.userService.addEmail(this.email);

    // Modal will auto-close due to subscription
    this.email = ''; // clear input
  }

  ngOnDestroy(): void {
    this.emailSub?.unsubscribe();
  }
}
