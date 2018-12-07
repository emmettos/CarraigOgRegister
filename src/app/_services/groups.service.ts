import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


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
}
