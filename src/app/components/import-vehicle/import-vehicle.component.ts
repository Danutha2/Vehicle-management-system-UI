// import { Component } from '@angular/core';
// import { MemberService } from '../../services/member.service';
// import { CommonModule } from '@angular/common';
// import {  HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-import-vehicle',
//   standalone: true,
//   imports: [CommonModule,HttpClientModule],
//   templateUrl: './import-vehicle.component.html',
//   styleUrl: './import-vehicle.component.css'
// })
// export class ImportVehicleComponent {
//    selectedFile: File | null = null;
//   uploading = false;
//   message = '';

//   constructor(private memberService: MemberService) {}

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//       this.message = '';
//     }
//   }

//   uploadFile() {
//     if (!this.selectedFile) {
//       this.message = '⚠️ Please select a file first.';
//       return;
//     }

//     this.uploading = true;
//     this.message = '';

//     this.memberService.importMembers(this.selectedFile).subscribe({
//       next: () => {
//         this.uploading = false;
//         this.message = '✅ File uploaded successfully! Batch job started.';
//       },
//       error: (err) => {
//         console.error(err);
//         this.uploading = false;
//         this.message = '❌ Error uploading file. Please try again.';
//       },
//     });
//   }
// }


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
  message = '';
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
      this.message = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = '⚠️ Please select a file first.';
      return;
    }
    if (!this.email) {
      this.message = '⚠️ Please enter your email first.';
      return;
    }

    this.uploading = true;
    this.message = '';

    this.memberService.importMembers(this.selectedFile, this.email).subscribe({
      next: () => {
        this.uploading = false;
        this.message = '✅ File uploaded successfully! Batch job started.';
      },
      error: (err) => {
        console.error(err);
        this.uploading = false;
        this.message = '❌ Error uploading file. Please try again.';
      },
    });
  }
}


