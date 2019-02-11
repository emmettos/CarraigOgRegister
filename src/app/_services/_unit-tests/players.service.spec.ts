import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlayer, IGroupPlayer, IPlayerSummary } from '../../_models';
import { PlayersService } from '../index';


describe('PlayersService', () => {
  let httpMock: HttpTestingController;

  let service: PlayersService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PlayersService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(PlayersService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for read player summaries', () => {
    service.readPlayerSummaries(2009)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/playerSummaries/2009');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for search players', () => {
    service.searchPlayers('2009-10-13 00:00:00')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/searchPlayers/2009-10-13 00:00:00');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for player details', () => {
    service.readPlayerDetails(1)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/playerDetails/1');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for create player', () => {
    service.createPlayer(null, null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createPlayer');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for create player', () => {
    let player: any = {
      'firstName': 'James',
      'surname': 'Maxwell',
      'addressLine1': '485 Meadowcrest Lane',
      'addressLine2': 'Capitol',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2008-10-10T00:00:00.000Z',
      'medicalConditions': 'Heart Murmur',
      'contactName': 'Kevia Maxwell',
      'contactMobileNumber': '087 3514954',
      'contactHomeNumber': '',
      'contactEmailAddress': 'kevia_maxwell@gmail.com',
      'school': 'Scoil Mhuire Lourdes'
    };
    let groupPlayer: any = {
      'groupId': 1,
      'dateRegistered': '2019-01-31 00:00:00'
    };

    service.createPlayer(player, groupPlayer)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createPlayer');

    expect(mockRequest.request.body).toEqual({
      playerDetails: {
        'firstName': 'James',
        'surname': 'Maxwell',
        'addressLine1': '485 Meadowcrest Lane',
        'addressLine2': 'Capitol',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2008-10-10T00:00:00.000Z',
        'yearOfBirth': 2008,
        'medicalConditions': 'Heart Murmur',
        'contactName': 'Kevia Maxwell',
        'contactMobileNumber': '087 3514954',
        'contactHomeNumber': '',
        'contactEmailAddress': 'kevia_maxwell@gmail.com',
        'school': 'Scoil Mhuire Lourdes'
      },
      groupPlayerDetails: {
        'groupId': 1,
        'dateRegistered': '2019-01-31 00:00:00'  
      }
    });

    mockRequest.flush(null);
  });

  it('should call url for update player', () => {
    service.updatePlayer(null, null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updatePlayer');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for update player', () => {
    let player: IPlayer = {
      'id': 1,
      'firstName': 'Luke',
      'surname': 'Stewart',
      'addressLine1': '1035 Harley Brook Lane',
      'addressLine2': 'Carrigaline',
      'addressLine3': '',
      'dateOfBirth': '2010-07-02T00:00:00.000Z',
      'medicalConditions': '',
      'contactName': 'Danelle Stewart',
      'contactMobileNumber': '087 9733637',
      'contactHomeNumber': '',
      'contactEmailAddress': 'danelle_stewart@gmail.com',
      'school': 'Gaelscoil',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-13T10:17:21.332Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'version': '2018-02-13T10:17:21.332Z'
    }
    let groupPlayer: IGroupPlayer = {
      'id': 1,
      'groupId': 1,
      'playerId': 1,
      'registeredDate': '2019-01-31 00:00:00',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-13T10:17:21.332Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'version': '2018-02-13T10:17:21.332Z'
    };

    service.updatePlayer(player, groupPlayer)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updatePlayer');

    expect(mockRequest.request.body).toEqual({
      playerDetails: {
        'id': 1,
        'firstName': 'Luke',
        'surname': 'Stewart',
        'addressLine1': '1035 Harley Brook Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-07-02T00:00:00.000Z',
        'medicalConditions': '',
        'contactName': 'Danelle Stewart',
        'contactMobileNumber': '087 9733637',
        'contactHomeNumber': '',
        'contactEmailAddress': 'danelle_stewart@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:17:21.332Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com',
        'version': '2018-02-13T10:17:21.332Z'
      },
      groupPlayerDetails: {
        'id': 1,
        'groupId': 1,
        'playerId': 1,
        'registeredDate': '2019-01-31 00:00:00',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:17:21.332Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com',
        'version': '2018-02-13T10:17:21.332Z'
      }
    });

    mockRequest.flush(null);
  });

  it('should call url for delete player', () => {
    service.deletePlayer(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deletePlayer');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for delete player', () => {
    let playerSummary: IPlayerSummary = {
      'id': 2,
      'firstName': 'Matthew',
      'surname': 'Moss',
      'addressLine1': '179 Payne Street',
      'addressLine2': 'Clear Mount',
      'addressLine3': 'Carrigaline',
      'yearOfBirth': 2010,
      'dateOfBirth': '2010-03-03',
      'medicalConditions': '',
      'contactName': 'Wilder Moss',
      'contactMobileNumber': '087 6186779',
      'contactHomeNumber': '',
      'contactEmailAddress': 'wilder_moss@gmail.com',
      'school': '',
      'version': '2018-02-04T15:13:00.000Z',
      'lastRegisteredDate': '2018-02-04',
      'playerState': 0
    }

    service.deletePlayer(playerSummary)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deletePlayer');

    expect(mockRequest.request.body).toEqual({
      playerSummary: {
        'id': 2,
        'firstName': 'Matthew',
        'surname': 'Moss',
        'addressLine1': '179 Payne Street',
        'addressLine2': 'Clear Mount',
        'addressLine3': 'Carrigaline',
        'yearOfBirth': 2010,
        'dateOfBirth': '2010-03-03',
        'medicalConditions': '',
        'contactName': 'Wilder Moss',
        'contactMobileNumber': '087 6186779',
        'contactHomeNumber': '',
        'contactEmailAddress': 'wilder_moss@gmail.com',
        'school': '',
        'version': '2018-02-04T15:13:00.000Z',
        'lastRegisteredDate': '2018-02-04',
        'playerState': 0
        }
    });

    mockRequest.flush(null);
  });

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});