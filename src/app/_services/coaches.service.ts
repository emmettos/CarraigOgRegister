import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ICoach } from '../_models/index';


@Injectable()
export class CoachesService {
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

  readCoaches(): Observable<any> {
    return this.http.get<any>('/api/coaches');
  }

  updateCoach(coachDetails: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coachDetails;
   
    return this.http.post("/api/updateCoach", postData);
  }

  createCoach(coachDetails: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coachDetails;

    return this.http.post("/api/createCoach", postData);    
  }

  deleteCoach(coachDetails: ICoach): Observable<any> {
    let postData = {};

    postData['coachId'] = coachDetails._id;

    return this.http.post("/api/deleteCoach", postData);    
  }
}
