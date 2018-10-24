import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {
  }

  changePassword(emailAddress: string, password: string, newPassword: string): Observable<any> {
    return this.http.post('/api/changePassword', { 
      'emailAddress': emailAddress, 
      'password': password,
      'newPassword': newPassword
    });
  }

  login(emailAddress: string, password: string): Observable<any> {
    return this.http.post('/api/authenticate', { 
      'emailAddress': emailAddress, 
      'password': password 
    });
  }

  readUsers(): Observable<any> {
    return this.http.get<any>('/api/users');
  }
}
