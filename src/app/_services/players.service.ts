import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IPlayer } from '../_models';


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

  updatePlayer(playerDetails: IPlayer, year: number, yearOfBirth: number): Observable<any> {
    let postData = {};

    postData['groupDetails'] = {};
    postData['groupDetails']['year'] = year;
    postData['groupDetails']['yearOfBirth'] = yearOfBirth;
    
    postData['playerDetails'] = playerDetails;

    return this.http.post("/api/updatePlayer", postData);
  }

  createPlayer(playerDetails: IPlayer, year: number, yearOfBirth: number): Observable<any> {
    let postData = {};

    postData['groupDetails'] = {};
    postData['groupDetails']['year'] = year;
    postData['groupDetails']['yearOfBirth'] = yearOfBirth;
    
    postData['playerDetails'] = playerDetails;

    return this.http.post("/api/createPlayer", postData);    
  }
}
