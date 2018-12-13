import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IGroup } from '../_models/index';


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

  updateGroup(group: IGroup): Observable<any> {
    let postData = {};

    postData['groupDetails'] = group;
   
    return this.http.post("/api/updateGroup", postData);
  }
}
