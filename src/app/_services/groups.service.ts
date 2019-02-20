import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import { IGroup, IGroupSummary } from '../_models/index';


@Injectable()
export class GroupsService {
  constructor(private http: HttpClient) {
  }

  readGroupSummaries(): Observable<any> {
    return this.http.get<any>('/api/groupSummaries');
  }

  readGroups(): Observable<any> {
    return this.http.get<any>('/api/groups');
  }

  readGroupDetails(groupId: number): Observable<any> {
    return this.http.get<any>('/api/groupDetails/' + groupId);
  }

  createGroup(groupDetails: IGroup): Observable<any> {
    let postData = {};

    postData['groupDetails'] = groupDetails;

    return this.http.post("/api/createGroup", postData);
  }

  updateGroup(group: IGroup): Observable<any> {
    let postData = {};

    postData['groupDetails'] = group;
   
    return this.http.post('/api/updateGroup', postData);
  }

  deleteGroup(groupSummary: IGroupSummary): Observable<any> {
    let postData = {};

    postData['groupSummary'] = groupSummary;

    return this.http.post("/api/deleteGroup", postData);
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
