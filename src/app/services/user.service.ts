import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private emails: string[] = [];
  private emailsSubject = new BehaviorSubject<string[]>([]);

  // Observable that components can subscribe to
  emails$ = this.emailsSubject.asObservable();

  // Add a new email to the array
  addEmail(email: string) {
    if (email && !this.emails.includes(email)) {
      this.emails.push(email);
      this.emailsSubject.next([...this.emails]); // emit updated array
    }
  }

  // Get all emails
  getEmails(): string[] {
    return [...this.emails];
  }

  // Check if any email exists
  hasEmail(): boolean {
    return this.emails.length > 0;
  }

  // Get the latest email (optional)
  getLatestEmail(): string | null {
    return this.emails.length ? this.emails[this.emails.length - 1] : null;
  }
}
