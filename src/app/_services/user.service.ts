import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  changePassword(emailAddress: string, newPassword: string, password: string): Observable<any> {
    return this.http.post('/api/changePassword', { 
      'emailAddress': emailAddress, 
      'newPassword': newPassword,
      'password': password
    });
  }

  login(emailAddress: string, password: string): Observable<any> {
    return this.http.post('/api/authenticate', { 
      'emailAddress': emailAddress, 
      'password': password 
    });
  }
}
