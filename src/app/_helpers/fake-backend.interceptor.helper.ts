import { Injectable, Injector } from '@angular/core';
import { 
  HttpRequest, 
  HttpResponse, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { IGroup, IPlayer } from '../_models/index'; 
import { APP_SETTINGS } from '../_helpers/app.initializer.helper';
import { AuthorizationService, AlertService } from '../_services/index';


const CURRENT_SETTINGS_KEY = 'carraig-og-register.fake-backend.currentSettings';
const USERS_KEY = 'carraig-og-register.fake-backend.users';
const GROUPS_KEY = 'carraig-og-register.fake-backend.groups';
const PLAYERS_KEY = 'carraig-og-register.fake-backend.players';

@Injectable()
export class FakeBackendInterceptorHelper implements HttpInterceptor {
  private currentSettings: any;
  private users: any[];
  private groups: IGroup[];
  private players: IPlayer[];

  constructor(
      private injector: Injector,
      private authorizationService: AuthorizationService) { 
    this.currentSettings = JSON.parse(localStorage.getItem(CURRENT_SETTINGS_KEY)) || {
      year: 2018,
      groupYears: [2008, 2009, 2010, 2011, 2012, 2013]
    };

    this.users = JSON.parse(localStorage.getItem(USERS_KEY)) || [
      {
        emailAddress: 'administrator@carraigog.com',
        fullName: 'Administrator',
        isAdministrator: true,
        isManager: false,
        groups: [],
        password: 'Password01#'
      },
      {
        emailAddress: 'football2009@carraigog.com',
        fullName: 'Football 2009',
        isAdministrator: false,
        isManager: true,
        groups: [2009],
        password: 'Password01#'
      },
      {
        emailAddress: 'hurling2009@carraigog.com',
        fullName: 'Hurling 2009',
        isAdministrator: false,
        isManager: true,
        groups: [2009],
        password: 'Password01#'
      }
    ];

    this.groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [
      {
        'year': 2018,
        'name': 'Under 10',
        'yearOfBirth': 2008,
        'footballManager': 'Football 2008',
        'hurlingManager': 'Hurling 2008',
        'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
        'numberOfPlayers': 3
      },
      {
        'year': 2018,
        'name': 'Under 9',
        'yearOfBirth': 2009,
        'footballManager': 'Football 2009',
        'hurlingManager': 'Hurling 2009',
        'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
        'numberOfPlayers': 10
      },
      {
        'year': 2018,
        'name': 'Under 8',
        'yearOfBirth': 2010,
        'footballManager': 'Football 2010',
        'hurlingManager': 'Hurling 2010',
        'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
        'numberOfPlayers': 4
      },
      {
        'year': 2018,
        'name': 'Under 7',
        'yearOfBirth': 2011,
        'footballManager': 'Football 2011',
        'hurlingManager': 'Hurling 2011',
        'lastUpdatedDate': '2018-02-27T16:00:20.439Z',
        'numberOfPlayers': 5
      },
      {
        'year': 2018,
        'name': 'Under 6',
        'yearOfBirth': 2012,
        'footballManager': 'Football 2012',
        'hurlingManager': 'Hurling 2012',
        'lastUpdatedDate': '2018-02-27T12:20:39.338Z',
        'numberOfPlayers': 3
      },
      {
        'year': 2018,
        'name': 'Under 5',
        'yearOfBirth': 2013,
        'footballManager': 'Football 2013',
        'hurlingManager': 'Hurling 2013',
        'lastUpdatedDate': '2018-02-27T12:09:40.660Z',
        'numberOfPlayers': 4
      }
    ];

    this.players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [
      // 2008 players (3 current - 1 missing)
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
        '_id': 'aaf6ddc582e9d0d86610e025',
        'firstName': 'Joshua',
        'surname': 'Love',
        'addressLine1': '4032 Heliport Loop',
        'addressLine2': 'Gold Cliff',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2008-06-20T00:00:00.000Z',
        'yearOfBirth': 2008,
        'medicalConditions': '',
        'contactName': 'Dilan Love',
        'contactMobileNumber': '087 4765397',
        'contactHomeNumber': '021 9445529',
        'contactEmailAddress': 'dilan_love@hotmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
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
        'updatedDate': '2018-02-13T14:38:36.668Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '4162aaefa0842a667363b49c',
        'firstName': 'Mark',
        'surname': 'Anderson',
        'addressLine1': '151 Airway Estate',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2008-06-02T00:00:00.000Z',
        'yearOfBirth': 2008,
        'medicalConditions': '',
        'contactName': 'Pete Anderson',
        'contactMobileNumber': '087 4852217',
        'contactHomeNumber': '',
        'contactEmailAddress': 'pete_anderson@hotmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2017-03-01T00:00:00.000Z',
        'lastRegisteredYear': 2017,
        'registeredYears': [
          2013,
          2014,
          2015,
          2016,
          2017
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      // 2009 players (10 current - 1 missing - 1 gone)
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
        '_id': 'd081a7d3547019f961490701',
        'firstName': 'Daniel',
        'surname': 'Hunt',
        'addressLine1': '427 College Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-03-28T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': 'Nut Allergy',
        'contactName': 'Welborn Hunt',
        'contactMobileNumber': '087 6467640',
        'contactHomeNumber': '021 7702044',
        'contactEmailAddress': 'welborn_hunt@gmail.com',
        'school': '',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T09:57:59.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '607ee42c60e409ac1c65525f',
        'firstName': 'Ethan',
        'surname': 'Gill',
        'addressLine1': '2002 Graystone Lakes',
        'addressLine2': 'Irving',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-11-11T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Cian Gill',
        'contactMobileNumber': '087 8392576',
        'contactHomeNumber': '021 7925314',
        'contactEmailAddress': 'cian_gill@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-05-09T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-20T12:12:47.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '8f9d3ffcec6738a57d4586b7',
        'firstName': 'Ben',
        'surname': 'Owen',
        'addressLine1': '1320 Broad Street',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-04-08T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': 'Asthma',
        'contactName': 'Cola Owen',
        'contactMobileNumber': '087 4105484',
        'contactHomeNumber': '',
        'contactEmailAddress': 'cola_owen@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T09:58:11.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '122e56fa9d578c7d5c5777f7',
        'firstName': 'Sam',
        'surname': 'Bond',
        'addressLine1': '4848 Quilly Lane',
        'addressLine2': 'Whispering Pines',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-06-10T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Eleri Bond',
        'contactMobileNumber': '087 3683432',
        'contactHomeNumber': '',
        'contactEmailAddress': 'eleri_bond@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:00:42.251Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '510239c0556e1f1c0591df47',
        'firstName': 'Jacob',
        'surname': 'Cohen',
        'addressLine1': '1768 Mulberry Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-10-27T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Gordon Cohen',
        'contactMobileNumber': '087 3994863',
        'contactHomeNumber': '',
        'contactEmailAddress': 'gordon_cohen@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-13T10:02:53.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '380afa03b146e48007ebbe2e',
        'firstName': 'Nathan',
        'surname': 'Wells',
        'addressLine1': '2038 Timber Ridge Road',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-05-05T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Graysen Wells',
        'contactMobileNumber': '087 7090891',
        'contactHomeNumber': '',
        'contactEmailAddress': 'graysen_wells@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-04-03T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T13:12:02.563Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'ed8d5d4c80eb6f61479364ed',
        'firstName': 'Isaac',
        'surname': 'Powell',
        'addressLine1': '4512 James Street',
        'addressLine2': 'Eagle',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-02-13T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Bud Powell',
        'contactMobileNumber': '087 3255332',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bud_powell@gmail.com',
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
        'updatedDate': '2018-02-12T10:55:43.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '57e4879d1213f48fdcb1d713',
        'firstName': 'Lucas',
        'surname': 'Weaver',
        'addressLine1': '4483 Willis Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-06-06T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Val Weaver',
        'contactMobileNumber': '087 5940986',
        'contactHomeNumber': '',
        'contactEmailAddress': 'val_weaver@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
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
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:11:22.989Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'b5206d7a3fa266dcd76f1182',
        'firstName': 'Noah',
        'surname': 'Slater',
        'addressLine1': '3703  Cunningham Court',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-07-21T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Harry Slater',
        'contactMobileNumber': '087 3165674',
        'contactHomeNumber': '',
        'contactEmailAddress': 'harry_slater@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:15:01.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'ed39407459c1f36f79d4c533',
        'firstName': 'Evan',
        'surname': 'Kelleher',
        'addressLine1': '10 Greenhills Court',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-04-29T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Mike Kelleher',
        'contactMobileNumber': '087 8677213',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mike_kelleher@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2017-02-06T00:00:00.000Z',
        'lastRegisteredYear': 2017,
        'registeredYears': [
          2016,
          2017
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2017-02-13T10:15:01.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'c836901fac13de5d9e05a330',
        'firstName': 'Peter',
        'surname': 'Parker',
        'addressLine1': '1001 Spider Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-02-27T00:00:00.000Z',
        'yearOfBirth': 2009,
        'medicalConditions': '',
        'contactName': 'Mark Parker',
        'contactMobileNumber': '087 6655918',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mark_parker@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2016-03-04T00:00:00.000Z',
        'lastRegisteredYear': 2016,
        'registeredYears': [
          2016
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      // 2010 players (4 current - 1 missing)
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
      },
      {
        '_id': 'e943c923036a302151ad8ecd',
        'firstName': 'Matthew',
        'surname': 'Moss',
        'addressLine1': '179 Payne Street',
        'addressLine2': 'Clear Mount',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2010-03-03T00:00:00.000Z',
        'yearOfBirth': 2010,
        'medicalConditions': '',
        'contactName': 'Wilder Moss',
        'contactMobileNumber': '087 6186779',
        'contactHomeNumber': '',
        'contactEmailAddress': 'wilder_moss@gmail.com',
        'school': '',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:18:45.622Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '5c9370bdf1715519108e526e',
        'firstName': 'Michael',
        'surname': 'Wolfe',
        'addressLine1': '830 Green Gate Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-11-27T00:00:00.000Z',
        'yearOfBirth': 2010,
        'medicalConditions': 'Asthma',
        'contactName': 'Moss Wolfe',
        'contactMobileNumber': '087 7128560',
        'contactHomeNumber': '021 9292476',
        'contactEmailAddress': 'moss_wolfe@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
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
        'updatedDate': '2018-02-13T10:21:40.545Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '42fc90bd782e4c0d683b014b',
        'firstName': 'Adam',
        'surname': 'Knowles',
        'addressLine1': '1465 Saint Francis Way',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-12-02T00:00:00.000Z',
        'yearOfBirth': 2010,
        'medicalConditions': '',
        'contactName': 'Gruffud Knowles',
        'contactMobileNumber': '087 6182986',
        'contactHomeNumber': '021 9928490',
        'contactEmailAddress': 'gruffud_knowles@gmail.com',
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
        'updatedDate': '2018-02-13T10:23:40.012Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '66b6d82e1e2e55a0a20cfd5a',
        'firstName': 'Jimmy',
        'surname': 'White',
        'addressLine1': '147 The Crucible',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-12-02T00:00:00.000Z',
        'yearOfBirth': 2010,
        'medicalConditions': '',
        'contactName': 'Alan White',
        'contactMobileNumber': '087 4297741',
        'contactHomeNumber': '',
        'contactEmailAddress': 'alan_white@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2017-05-04T00:00:00.000Z',
        'lastRegisteredYear': 2017,
        'registeredYears': [
          2015,
          2016,
          2017
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2017-05-13T11:44:40.001Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      // 2011 players (5 current)
      {
        '_id': '854e0830112e259dfc88dd77',
        'firstName': 'Alex',
        'surname': 'Matthews',
        'addressLine1': '4198 Valley Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': 'Nut Allergy',
        'dateOfBirth': '2011-08-15T00:00:00.000Z',
        'yearOfBirth': 2011,
        'medicalConditions': '',
        'contactName': 'Lorene Matthews',
        'contactMobileNumber': '087 4644456',
        'contactHomeNumber': '021 9376713',
        'contactEmailAddress': 'lorene_matthews@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-06-10T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-06-17T12:07:22.735Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '3df691919cee6a5e2248e349',
        'firstName': 'Andrew',
        'surname': 'Sanders',
        'addressLine1': '1225 Morningview Lane',
        'addressLine2': 'Little Cedar',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2011-10-24T00:00:00.000Z',
        'yearOfBirth': 2011,
        'medicalConditions': '',
        'contactName': 'West Sanders',
        'contactMobileNumber': '087 8085200',
        'contactHomeNumber': '',
        'contactEmailAddress': 'west_sanders@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:30:01.222Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'b1fa15340170ce42880ddea5',
        'firstName': 'David',
        'surname': 'Howard',
        'addressLine1': '657 Richland Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-08-31T00:00:00.000Z',
        'yearOfBirth': 2011,
        'medicalConditions': '',
        'contactName': 'Mark Howard',
        'contactMobileNumber': '087 3261389',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mark_howard@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:30:33.722Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '5236fda1a40968c993b2c4e1',
        'firstName': 'Peter',
        'surname': 'Rowland',
        'addressLine1': '374 Findley Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-06-30T00:00:00.000Z',
        'yearOfBirth': 2011,
        'medicalConditions': '',
        'contactName': 'Jerren Rowland',
        'contactMobileNumber': '087 3720760',
        'contactHomeNumber': '',
        'contactEmailAddress': 'jerren_rowland@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2016,
          2017,
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:30:11.556Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'b98e73d80dc910404a0a18ed',
        'firstName': 'Jason',
        'surname': 'Stevenson',
        'addressLine1': '1509 Scenic Way',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-06-20T00:00:00.000Z',
        'yearOfBirth': 20111,
        'medicalConditions': 'Asthma',
        'contactName': 'Clare Stevenson',
        'contactMobileNumber': '087 8719730',
        'contactHomeNumber': '',
        'contactEmailAddress': 'clare_stevenson@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T10:45:11.013Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      // 2012 players (3 current)
      {
        '_id': '9c02d9628e2957f79c55f52b',
        'firstName': 'Joel',
        'surname': 'Jacobs',
        'addressLine1': '2547 Harvest Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-05-09T00:00:00.000Z',
        'yearOfBirth': 2012,
        'medicalConditions': '',
        'contactName': 'Dusty Jacobs',
        'contactMobileNumber': '087 6669515',
        'contactHomeNumber': '',
        'contactEmailAddress': 'dusty_jacobs@gmail.com',
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
        'updatedDate': '2018-02-13T11:01:53.715Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': 'b6dbe6a9a6965f2050c43bc4',
        'firstName': 'Zach',
        'surname': 'Adams',
        'addressLine1': '3235 Woodridge Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-04-10T00:00:00.000Z',
        'yearOfBirth': 2012,
        'medicalConditions': 'Dyslexia',
        'contactName': 'Colton Adams',
        'contactMobileNumber': '087 6012884',
        'contactHomeNumber': '021 7048648',
        'contactEmailAddress': 'colton_adams@gmail.com',
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
        'updatedDate': '2018-02-13T11:22:20.002Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '72eadb693ea976d6ab6ef69d',
        'firstName': 'Ricky',
        'surname': 'Fox',
        'addressLine1': '3486 Nickel Road',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-11-07T00:00:00.000Z',
        'yearOfBirth': 2012,
        'medicalConditions': '',
        'contactName': 'Peter Fox',
        'contactMobileNumber': '087 6518787',
        'contactHomeNumber': '',
        'contactEmailAddress': 'peter_fox@gmail.com',
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
        'updatedDate': '2018-02-13T11:22:11.766Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      // 2013 players (4 current)
      {
        '_id': '0b8d359985f00a75acb772a6',
        'firstName': 'Daithi',
        'surname': 'Greenwood',
        'addressLine1': '447 Sardis Station',
        'addressLine2': 'Edgar',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2013-05-12T00:00:00.000Z',
        'yearOfBirth': 2013,
        'medicalConditions': 'Asthma',
        'contactName': 'Bob Greenwood',
        'contactMobileNumber': '087 3556729',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bob_greenwood@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T12:10:11.002Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '4458405291e9e8d309559d03',
        'firstName': 'Bobby',
        'surname': 'Morrison',
        'addressLine1': '1551 University Street',
        'addressLine2': 'Drainer',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2013-09-15T00:00:00.000Z',
        'yearOfBirth': 2013,
        'medicalConditions': '',
        'contactName': 'Jim Morrison',
        'contactMobileNumber': '087 3321026',
        'contactHomeNumber': '021 8384692',
        'contactEmailAddress': 'jim_morrison@gmail.com',
        'school': '',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T12:10:10.288Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '2d2a3e07ffb28694438ce90f',
        'firstName': 'Morgan',
        'surname': 'Booth',
        'addressLine1': '790 Jacobs Street',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2013-10-20T00:00:00.000Z',
        'yearOfBirth': 2013,
        'medicalConditions': '',
        'contactName': 'Watts Booth',
        'contactMobileNumber': '087 4678838',
        'contactHomeNumber': '021 6175523',
        'contactEmailAddress': 'watts_booth@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-13T09:34:49.734Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
      {
        '_id': '80bdda0c8e7fdde6c2345c91',
        'firstName': 'Mike',
        'surname': 'Warren',
        'addressLine1': '3595 Linden Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2013-03-17T00:00:00.000Z',
        'yearOfBirth': 2013,
        'medicalConditions': '',
        'contactName': 'Bronwyn Warren',
        'contactMobileNumber': '087 7443100',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bronwyn_warren@gmail.com',
        'school': 'Gaelscoil',
        'lastRegisteredDate': '2018-04-14T00:00:00.000Z',
        'lastRegisteredYear': 2018,
        'registeredYears': [
          2018
        ],
        '__v': 1,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-01T12:35:14.332Z',
        'updatedBy': 'emmett.j.osullivan@gmail.com'
      },
    ]
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null).pipe(
      mergeMap(() => {
        try {
          if (request.url.endsWith('/currentSettings')) {
            let body = {
              currentSettings: this.currentSettings
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/authenticate')) {
            let user: any = this.users.find(user => {
              return user.emailAddress === request.body.emailAddress;
            });

            if (!user) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'User not found'
                  }   
                }
              });
            }

            if (user.password !== request.body.password) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'Invalid password'
                  }   
                }
              });
            }

            let issuedTime: number = Math.floor(Date.now() / 1000);

            this.authorizationService.payload = {
              userProfile: {
                ID: user.emailAddress,
                fullName: user.fullName,
                isAdministrator: user.isAdministrator,
                isManager: user.isManager,
                groups: user.groups
              },
              iat: issuedTime,
              exp: issuedTime + (60 * 60)
            }

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: {} }));
          }

          if (request.url.endsWith('/changePassword')) {
            let user: any = this.users.find(user => {
              return user.emailAddress === request.body.emailAddress;
            });

            if (!user) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'User not found'
                  }   
                }
              });
            }

            if (user.password !== request.body.password) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'Invalid password'
                  }   
                }
              });
            }

            user.password = request.body.newPassword;

            localStorage.setItem(USERS_KEY, JSON.stringify(this.users));

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: {} }));
          }

          if (request.url.endsWith('/groups')) {
            let body = {
              groups: this.groups
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (/.*\/api\/playersDetail\/2[0-9]{3}$/.test(request.url)) {
            let yearOfBirth: number = +request.url.substring(request.url.length - 4);

            let body = {
              players: this.players.filter(player => {
                return player.yearOfBirth === yearOfBirth
                && (player.lastRegisteredYear === APP_SETTINGS.currentYear || player.lastRegisteredYear === APP_SETTINGS.currentYear - 1);
              })
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (/.*\/api\/playersDetail\/2[0-9]{3}\/true$/.test(request.url)) {
            let yearOfBirth: number = +request.url.substring(request.url.length - 9, request.url.length - 5);

            let body = {
              players: this.players.filter(player => {
                return player.yearOfBirth === yearOfBirth;
              })
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/updatePlayer') || request.url.endsWith('/createPlayer')) {
            let playerDetails: IPlayer = null;
            
            if (request.url.endsWith('/updatePlayer')) {
              playerDetails = this.players.find(player => {
                return player._id === request.body.playerDetails._id;
              });
            }
            else {
              playerDetails = <IPlayer>{};

              playerDetails._id = Math.floor(Math.random() * 16777215).toString(16);

              playerDetails.firstName = request.body.playerDetails.firstName;
              playerDetails.surname = request.body.playerDetails.surname;
              
              playerDetails.dateOfBirth = request.body.playerDetails.dateOfBirth;
              playerDetails.yearOfBirth = (new Date(playerDetails.dateOfBirth)).getFullYear();

              playerDetails.__v = 0;

              this.players.push(playerDetails);
            }
            
            playerDetails.addressLine1 = request.body.playerDetails.addressLine1;
            playerDetails.addressLine2 = request.body.playerDetails.addressLine2;
            playerDetails.addressLine3 = request.body.playerDetails.addressLine3;
            playerDetails.medicalConditions = request.body.playerDetails.medicalConditions;
            playerDetails.contactName = request.body.playerDetails.contactName;
            playerDetails.contactHomeNumber = request.body.playerDetails.contactHomeNumber;
            playerDetails.contactMobileNumber = request.body.playerDetails.contactMobileNumber;
            playerDetails.contactEmailAddress = request.body.playerDetails.contactEmailAddress;
            playerDetails.school = request.body.playerDetails.school;
    
            playerDetails.lastRegisteredDate = request.body.playerDetails.lastRegisteredDate;
            playerDetails.lastRegisteredYear = (new Date(playerDetails.lastRegisteredDate)).getFullYear();
    
            if (request.url.endsWith('/updatePlayer')) {
              let lastRegisteredYear: number = playerDetails.registeredYears.find(registeredYear => {
                return registeredYear === playerDetails.lastRegisteredYear;
              });
              if (!lastRegisteredYear) {
                playerDetails.registeredYears.push(playerDetails.lastRegisteredYear);
              }
            }
            else {
              playerDetails.registeredYears = [playerDetails.lastRegisteredYear];
            }
            
            let lastUpdatedDate = (new Date(Date.now())).toISOString();

            playerDetails.updatedDate = lastUpdatedDate;
            playerDetails.updatedBy = this.authorizationService.payload.userProfile.ID;

            playerDetails.__v++;

            localStorage.setItem(PLAYERS_KEY, JSON.stringify(this.players));

            let group = this.groups.find(group => {
              return group.yearOfBirth === +request.body.groupDetails.yearOfBirth;
            });

            if (request.url.endsWith('/createPlayer')) {
              group.numberOfPlayers++;
            }

            group.lastUpdatedDate = lastUpdatedDate;

            localStorage.setItem(GROUPS_KEY, JSON.stringify(this.groups));

            let body = {
              player: playerDetails
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          let alertService: AlertService = this.injector.get(AlertService);

          alertService.error('Fake HTTP 404 Response', 'Fake backend does not support ' + request.url);
        }
        catch (error) {
          console.error(error);

          let alertService: AlertService = this.injector.get(AlertService);

          alertService.error('Fake HTTP 500 Response', error.message);
        }
      }),
      delay(200));
  }
}
