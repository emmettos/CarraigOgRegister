import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';


@Injectable()
export class PlayersService {
  constructor(private http: HttpClient) {
  }

  readCurrentPlayers(yearOfBirth: number): Observable<any> {
    return this.http.get<any>('/api/playersDetail/' + yearOfBirth);
  }

  readAllPlayers(yearOfBirth: number): Observable<any> {
    return this.http.get<any>('/api/playersDetail/' + yearOfBirth + '/true');    
  }
}
