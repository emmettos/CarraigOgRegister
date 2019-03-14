import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import { ICoach, ICoachSummary } from '../_models/index';


@Injectable()
export class CoachesService {
  constructor(private http: HttpClient) {
  }

  readCoachSummaries(): Observable<any> {
    return this.http.get<any>('/api/coachSummaries');
  }

  readCoaches(): Observable<any> {
    return this.http.get<any>('/api/coaches');
  }

  readCoachDetails(coachId: number): Observable<any> {
    return this.http.get<any>('/api/coachDetails/' + coachId);
  }

  createCoach(coach: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coach;

    return this.http.post("/api/createCoach", postData);    
  }

  updateCoach(coach: ICoach): Observable<any> {
    let postData = {};

    postData['coachDetails'] = coach;
   
    return this.http.post("/api/updateCoach", postData);
  }

  deleteCoach(coachSummary: ICoachSummary, sendGoodbyeEmail: Boolean): Observable<any> {
    let postData = {};

    postData['coachSummary'] = coachSummary;
    postData['sendGoodbyeEmail'] = sendGoodbyeEmail;

    return this.http.post("/api/deleteCoach", postData);    
  }

  downloadCSV(csvCoaches: any[]) {
    let options = { 
      showLabels: true, 
      headers: [
        'Email Address', 
        'Surname', 
        'First Name', 
        'Phone Number', 
        'Administrator',
        'Active'
      ]
    };

    new Angular5Csv(csvCoaches, 'CarraigOgCoaches', options);
  }
}
