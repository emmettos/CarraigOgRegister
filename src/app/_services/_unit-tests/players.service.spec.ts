import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlayer } from '../../_models';
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

  it('should call url for read current players', () => {
    service.readCurrentPlayers(2009)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/playersDetail/2009');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for read all players', () => {
    service.readAllPlayers(2009)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/playersDetail/2009/true');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for update player', () => {
    service.updatePlayer(null, 2018, 2009)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updatePlayer');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for update player', () => {
    let player: IPlayer = {
      '_id': '0c7858f9e15c90f70efba83e',
      'firstName': 'Luke',
      'surname': 'Stewart',
      'addressLine1': '1035 Harley Brook Lane',
      'addressLine2': 'Carrigaline',
      'addressLine3': '',
      'dateOfBirth': '2010-07-02T00:00:00.000Z',
      'yearOfBirth': 2010,
      'medicalConditions': '',
      'contactName': 'Danelle Stewart',
      'contactMobileNumber': '087 9733637',
      'contactHomeNumber': '',
      'contactEmailAddress': 'danelle_stewart@gmail.com',
      'school': 'Gaelscoil',
      'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
      'lastRegisteredYear': 2018,
      'registeredYears': [
        2015,
        2016,
        2017,
        2018
      ],
      '__v': 1,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-13T10:17:21.332Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'playerState': 0
    }

    service.updatePlayer(player, 2018, 2010)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updatePlayer');

    expect(mockRequest.request.body).toEqual({
      groupDetails: {
        year: 2018,
        yearOfBirth: 2010
      },
      playerDetails: {
        '_id': '0c7858f9e15c90f70efba83e',
        'firstName': 'Luke',
        'surname': 'Stewart',
        'addressLine1': '1035 Harley Brook Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-07-02T00:00:00.000Z',
        'yearOfBirth': 2010,
        'medicalConditions': '',
        'contactName': 'Danelle Stewart',
        'contactMobileNumber': '087 9733637',
        'contactHomeNumber': '',
        'contactEmailAddress': 'danelle_stewart@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2015,
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:17:21.332Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com',
        'playerState': 0
      }
    });

    mockRequest.flush(null);
  });

  it('should call url for create player', () => {
    service.createPlayer(null, 2018, 2009)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createPlayer');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for create player', () => {
    let player: IPlayer = {
      '_id': '58c669deb8a0ebcf9c5b93c9',
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
      'school': 'Scoil Mhuire Lourdes',
      'lastRegisteredDate': '2018-05-09T00:00:00.000Z',
      'lastRegisteredYear': 2018,
      'registeredYears': [
        2013,
        2014,
        2015,
        2016,
        2017,
        2018
      ],
      '__v': 1,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      playerState: 0
    };

    service.createPlayer(player, 2018, 2008)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createPlayer');

    expect(mockRequest.request.body).toEqual({
      groupDetails: {
        year: 2018,
        yearOfBirth: 2008
      },
      playerDetails: {
        '_id': '58c669deb8a0ebcf9c5b93c9',
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
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-05-09T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2013,
          2014,
          2015,
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com',
        playerState: 0
      }
    });

    mockRequest.flush(null);
  });

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});