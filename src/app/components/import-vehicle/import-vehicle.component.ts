import { Component } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-import-vehicle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './import-vehicle.component.html',
  styleUrls: ['./import-vehicle.component.css']
})
export class ImportVehicleComponent {
  selectedFile: File | null = null;
  uploading = false;
  email: string = '';

  constructor(private memberService: MemberService, private userService: UserService) {
    this.email = this.userService.getEmails()[0] || '';
    // Listen for email changes
    this.userService.emails$.subscribe(emails => {
      this.email = emails.length ? emails[emails.length - 1] : '';
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile || !this.email) return;

    this.uploading = true;

    this.memberService.importMembers(this.selectedFile, this.email).subscribe({
      next: () => {
        this.uploading = false;
        // WebSocket will handle notification
      },
      error: (err) => {
        console.error('Error uploading file:', err);
        this.uploading = false;
      },
    });
  }
}


