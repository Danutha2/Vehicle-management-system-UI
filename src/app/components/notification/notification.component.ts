import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AppNotification, NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  email: string = '';
  showModal = false;
  notifications: (AppNotification & { timeoutSet?: boolean })[] = [];

  private emailSub!: Subscription;
  private notificationSub!: Subscription;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.emailSub = this.userService.emails$.subscribe((emails) => {
      if (emails.length) {
        const latestEmail = emails[emails.length - 1];
        if (latestEmail !== this.email) {
          this.email = latestEmail;
          this.showModal = false;
          this.startListening(latestEmail);
        }
      } else {
        this.showModal = true;
      }
    });
  }

  startConnection() {
    if (this.email.trim()) {
      this.userService.addEmail(this.email);
      this.showModal = false;
    }
  }

  private startListening(email: string) {
    this.notificationService.connect(email);

    this.notificationSub?.unsubscribe();
    this.notificationSub = this.notificationService.notifications$.subscribe((messages) => {
      messages.forEach((msg) => this.showToast(msg));
    });
  }

  showToast(notification: AppNotification) {
    // Prevent duplicate notifications
    if (this.notifications.find(n => n.id === notification.id)) return;

    const notifWithTimeout = { ...notification, timeoutSet: false };
    this.notifications.push(notifWithTimeout);

    // Auto-dismiss after 10 seconds, only once
    if (!notifWithTimeout.timeoutSet) {
      notifWithTimeout.timeoutSet = true;
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.notificationService.removeNotificationById(notification.id);
      }, 10000);
    }
  }

  dismissNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationService.removeNotificationById(id);
  }

  ngOnDestroy() {
    this.emailSub?.unsubscribe();
    this.notificationSub?.unsubscribe();
  }
}
