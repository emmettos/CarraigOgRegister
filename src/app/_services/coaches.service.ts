import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import { ICoach } from '../_models/index';


@Injectable()
export class CoachesService {
  constructor(private http: HttpClient) {
  }

  readCoaches(): Observable<any> {
    return this.http.get<any>('/api/coaches');
  }

  updateCoach(coach: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coach;
   
    return this.http.post("/api/updateCoach", postData);
  }

  createCoach(coach: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coach;

    return this.http.post("/api/createCoach", postData);    
  }

  deleteCoach(coach: ICoach, sendGoodbyeEmail: Boolean): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coach;
    postData['sendGoodbyeEmail'] = sendGoodbyeEmail;

    return this.http.post("/api/deleteCoach", postData);    
  }

  readCoachGroups(coach: ICoach): Observable<any> {
    return this.http.get<any>('/api/coachGroups/' + coach.emailAddress);
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
