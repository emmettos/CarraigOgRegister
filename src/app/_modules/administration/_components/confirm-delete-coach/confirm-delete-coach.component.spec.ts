import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler } from 'rxjs';

import { APP_SETTINGS } from '../../../../_helpers/index';

import { IPlayer } from '../../../../_models/index';
import { PlayersService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { MockDatePickerComponent } from '../../../../_modules/shared/_components/_mocks/mock-date-picker/mock-date-picker.component.spec';
import { ConfirmDeleteCoachComponent } from './confirm-delete-coach.component';


describe('CoachFormComponent', () => {
  let component: ConfirmDeleteCoachComponent;
  let fixture: ComponentFixture<ConfirmDeleteCoachComponent>;

  let playersService: PlayersService;

  let players: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockDatePickerComponent,
        ConfirmDeleteCoachComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        PlayersService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteCoachComponent);
    component = fixture.componentInstance;

    APP_SETTINGS.currentYear = 2018;
    APP_SETTINGS.groupYears = [ 2008, 2009, 2010, 2011, 2012, 2013 ];

    playersService = TestBed.get(PlayersService);

    players = [
      {
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
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'b159d6e49a41877180ba3826',
        'firstName': 'Thomas',
        'surname': 'Watkins',
        'addressLine1': '115 Evergreen Lane',
        'addressLine2': 'Richmond',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2008-05-04T00:00:00.000Z',
        'yearOfBirth': 2008,
        'medicalConditions': 'None',
        'contactName': 'Finley Watkins',
        'contactMobileNumber': '086 5882764',
        'contactHomeNumber': '021 4834511',
        'contactEmailAddress': 'finley_watkins@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-17T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2014,
          2015,
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-23T15:14:53.115Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '6e748e8723733e96603618cb',
        'firstName': 'Joseph',
        'surname': 'Gray',
        'addressLine1': '3893 Conifer Drive',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-09-01T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Jarren Gray',
        'contactMobileNumber': '087 6248175',
        'contactHomeNumber': '',
        'contactEmailAddress': 'jarren_gray@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T09:55:59.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
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
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      }
    ];

    spyOn(playersService, 'readAllPlayers')
      .and.callFake(yearOfBirth => {
        return of({
          "error": null,
          "body": {
            "players": players.filter(player => { return player.yearOfBirth === yearOfBirth })
          }
        });
      });

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          "player": {
            "_id": "58c729bab8a0eaef9c5b9422",
            "firstName": "New",
            "surname": "Player",
            "addressLine1": "New Address",
            "addressLine2": "",
            "addressLine3": "",
            "dateOfBirth": "2010-02-01T00:00:00.000Z",
            "yearOfBirth": 2010,
            "medicalConditions": "",
            "contactName": "Player Contact",
            "contactMobileNumber": "087 1234567",
            "contactHomeNumber": "",
            "contactEmailAddress": "playercontact@gmail.com",
            "school": "",
            "lastRegisteredDate": "2018-08-24T00:00:00.000Z",
            "lastRegisteredYear": 2018,
            "registeredYears": [
                2018
            ],
            "__v": 1,
            "createdBy": "script",
            "createdDate": "2018-08-24T13:43:51.268Z",
            "updatedDate": "2018-08-24T09:55:59.735Z",
            "updatedBy": "unittest@gmail.com"
          }
        }
      }, asyncScheduler));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
