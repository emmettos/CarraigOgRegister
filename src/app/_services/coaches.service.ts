import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { ICoach } from '../_models/index';


@Injectable()
export class CoachesService {
  constructor(private http: HttpClient) {
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

  deleteCoach(coachDetails: ICoach, sendGoodbyeEmail: Boolean): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coachDetails;
    postData['sendGoodbyeEmail'] = sendGoodbyeEmail;

    return this.http.post("/api/deleteCoach", postData);    
  }

  downloadCSV(csvCoaches: any[]) {
    let options = { 
      showLabels: true, 
      headers: [
        "Email Address", 
        "Surname", 
        "First Name", 
        "Phone Number", 
        "Administrator"
      ]
    };

    new Angular5Csv(csvCoaches, 'CarraigOgCoaches', options);
  }
}
