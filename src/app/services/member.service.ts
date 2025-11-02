import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private backendUrl = 'http://localhost:3001/vehicle-service/import'; 

  constructor(private http: HttpClient) {}

  importMembers(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email); // send email along with file
    return this.http.post(`${this.backendUrl}`, formData);
  }
}

