import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import { IPlayer, IGroupPlayer } from '../_models';


@Injectable()
export class PlayersService {
  constructor(private http: HttpClient) {
  }

  readPlayerSummaries(yearOfBirth: number): Observable<any> {
    return this.http.get<any>('/api/playerSummaries/' + yearOfBirth);
  }

  searchPlayers(dateOfBirth: string): Observable<any> {
    return this.http.get<any>('/api/searchPlayers/' + dateOfBirth);
  }

  readPlayerDetails(playerId: number): Observable<any> {
    return this.http.get<any>('/api/playerDetails/' + playerId);
  }

  createPlayer(playerDetails: IPlayer, groupPlayerDetails: IGroupPlayer): Observable<any> {
    let postData = {};

    postData['playerDetails'] = playerDetails;
    postData['groupPlayerDetails'] = groupPlayerDetails;

    return this.http.post("/api/createPlayer", postData);    
  }

  updatePlayer(playerDetails: IPlayer, groupPlayerDetails: IGroupPlayer): Observable<any> {
    let postData = {};

    postData['playerDetails'] = playerDetails;
    postData['groupPlayerDetails'] = groupPlayerDetails;

    return this.http.post("/api/updatePlayer", postData);    
  }

  downloadCSV(csvPlayers: any[]) {
    let options = { 
      showLabels: true, 
      headers: [
        "Surname", 
        "First Name", 
        "Address Line 1", 
        "Address Line 2", 
        "Address Line 3",
        "Date of Birth",
        "Last Registered Date",
        "Medical Conditions",
        "Contact Name",
        "Contact Email",
        "Contact Mobile",
        "Contact Home",
        "School"]
    };

    new Angular5Csv(csvPlayers, 'CarraigOgPlayers', options);
  }
}
