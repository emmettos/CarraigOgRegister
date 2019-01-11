import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { IGroup } from '../_models/index';


@Injectable()
export class GroupsService {
  constructor(private http: HttpClient) {
  }

  readGroupOverviews(): Observable<any> {
    return this.http.get<any>('/api/groupOverviews');
  }

  readGroupSummaries(): Observable<any> {
    return this.http.get<any>('/api/groupSummaries');
  }

  readGroups(): Observable<any> {
    return this.http.get<any>('/api/groups');
  }

  updateGroup(group: IGroup): Observable<any> {
    let postData = {};

    postData['groupDetails'] = group;
   
    return this.http.post('/api/updateGroup', postData);
  }

  downloadCSV(csvGroups: any[]) {
    let options = { 
      showLabels: true, 
      headers: [
        'Name', 
        'Football Coach', 
        'Hurling Coach', 
        'Players Last Updated'
      ]
    };

    new Angular5Csv(csvGroups, 'CarraigOgGroups', options);
  }
}
