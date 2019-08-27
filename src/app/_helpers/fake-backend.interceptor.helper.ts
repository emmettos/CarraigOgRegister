import { Injectable, Injector } from '@angular/core';
import { 
  HttpRequest, 
  HttpResponse, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

import { clone, cloneDeep, remove } from 'lodash';

import * as moment from 'moment';

import { IPlayer, ICoach, IGroup, IGroupPlayer, PlayerState } from '../_models/index'; 
import { AuthorizationService, AlertService } from '../_services/index';


const YEARS_KEY = 'carraig-og-register.fake-backend.years';
const COACHES_KEY = 'carraig-og-register.fake-backend.coaches';
const GROUPS_KEY = 'carraig-og-register.fake-backend.groups';
const PLAYERS_KEY = 'carraig-og-register.fake-backend.players';
const GROUPS_PLAYERS_KEY = 'carraig-og-register.fake-backend.groupsPlayers';

@Injectable()
export class FakeBackendInterceptorHelper implements HttpInterceptor {
  private years: any[];
  private coaches: ICoach[];
  private groups: IGroup[];
  private players: IPlayer[];
  private groupsPlayers: IGroupPlayer[];

  private currentYear: any;

  private coachesCoachIdMap: Map<number, ICoach>;
  private groupsGroupIdMap: Map<number, IGroup>;
  private currentGroupsFootballCoachIdMap: Map<number, IGroup[]>;
  private currentGroupsHurlingCoachIdMap: Map<number, IGroup[]>;
  private playersPlayerIdMap: Map<number, IPlayer>;
  private playersDateOfBirthMap: Map<string, IPlayer[]>;
  private groupsPlayersPlayerIdMap: Map<number, IGroupPlayer[]>;

  private maxCoachesId: number = 0;
  private maxGroupsId: number = 0;
  private maxPlayersId: number = 0;
  private maxGroupsPlayersId: number = 0;

  constructor(
      private injector: Injector,
      private authorizationService: AuthorizationService) { 
    this.years = JSON.parse(localStorage.getItem(YEARS_KEY)) || [
      {
        'id': 1,
        'year': 2017,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 2,
        'year': 2018,
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 3,
        'year': 2019,
        'createdBy': 'script',
        'createdDate': '2019-03-17T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-17T13:43:51.268Z'
      }
    ];

    this.coaches = JSON.parse(localStorage.getItem(COACHES_KEY)) || [
      {
        'id': 1,
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'password': 'Password01#',
        'administrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 2,
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 3,
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 4,
        'firstName': 'Kylar',
        'surname': 'Hart',
        'emailAddress': 'kylar_hart@carraigog.com',
        'phoneNumber': '087 8659075',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 5,
        'firstName': 'Sherlock',
        'surname': 'Yang',
        'emailAddress': 'sherlock_yang@carraigog.com',
        'phoneNumber': '086 4215202',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 6,
        'firstName': 'Winfield',
        'surname': 'Owens',
        'emailAddress': 'winfield_owens@carraigog.com',
        'phoneNumber': '087 2322272',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 7,
        'firstName': 'Rowan',
        'surname': 'Love',
        'emailAddress': 'rowan_love@carraigog.com',
        'phoneNumber': '085 2399314',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 8,
        'firstName': 'Siward',
        'surname': 'Hansen',
        'emailAddress': 'siward_hansen@carraigog.com',
        'phoneNumber': '086 1949623',
        'password': 'Password01#',
        'administrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 9,
        'firstName': 'Bryok',
        'surname': 'Moran',
        'emailAddress': 'bryok_moran@carraigog.com',
        'phoneNumber': '087 8108797',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 10,
        'firstName': 'John',
        'surname': 'Rees',
        'emailAddress': 'john_rees@carraigog.com',
        'phoneNumber': '086 1702956',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 11,
        'firstName': 'Heddwyn',
        'surname': 'Cunningham',
        'emailAddress': 'heddwyn_cunningham@carraigog.com',
        'phoneNumber': '086 8600913',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 12,
        'firstName': 'Angel',
        'surname': 'Klein',
        'emailAddress': 'angel_klein@carraigog.com',
        'phoneNumber': '086 2175716',
        'password': 'Password01#',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      }
    ];

    this.groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [
      {
        'id': 1,
        'yearId': 1,
        'name': 'Under 5',
        'yearOfBirth': 2012,
        'footballCoachId': 3,
        'hurlingCoachId': 2,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 2,
        'yearId': 1,
        'name': 'Under 6',
        'yearOfBirth': 2011,
        'footballCoachId': 3,
        'hurlingCoachId': 4,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 3,
        'yearId': 1,
        'name': 'Under 7',
        'yearOfBirth': 2010,
        'footballCoachId': 5,
        'hurlingCoachId': 6,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 4,
        'yearId': 1,
        'name': 'Under 8',
        'yearOfBirth': 2009,
        'footballCoachId': 7,
        'hurlingCoachId': 8,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 5,
        'yearId': 1,
        'name': 'Under 9',
        'yearOfBirth': 2008,
        'footballCoachId': 9,
        'hurlingCoachId': 10,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 6,
        'yearId': 1,
        'name': 'Under 10',
        'yearOfBirth': 2007,
        'footballCoachId': 11,
        'hurlingCoachId': 12,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 7,
        'yearId': 2,
        'name': 'Under 5',
        'yearOfBirth': 2013,
        'footballCoachId': 2,
        'hurlingCoachId': 2,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 8,
        'previousGroupId': 1,
        'yearId': 2,
        'name': 'Under 6',
        'yearOfBirth': 2012,
        'footballCoachId': 3,
        'hurlingCoachId': 4,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 9,
        'previousGroupId': 2,
        'yearId': 2,
        'name': 'Under 7',
        'yearOfBirth': 2011,
        'footballCoachId': 5,
        'hurlingCoachId': 6,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 10,
        'previousGroupId': 3,
        'yearId': 2,
        'name': 'Under 8',
        'yearOfBirth': 2010,
        'footballCoachId': 7,
        'hurlingCoachId': 8,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 11,
        'previousGroupId': 4,
        'yearId': 2,
        'name': 'Under 9',
        'yearOfBirth': 2009,
        'footballCoachId': 9,
        'hurlingCoachId': 10,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 12,
        'previousGroupId': 5,
        'yearId': 2,
        'name': 'Under 10',
        'yearOfBirth': 2008,
        'footballCoachId': 11,
        'hurlingCoachId': 12,
        'createdBy': 'script',
        'createdDate': '2018-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-15T13:43:51.268Z'
      },
      {
        'id': 13,
        'yearId': 3,
        'name': 'Under 5',
        'yearOfBirth': 2014,
        'footballCoachId': 6,
        'hurlingCoachId': 2,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      },
      {
        'id': 14,
        'previousGroupId': 7,
        'yearId': 3,
        'name': 'Under 6',
        'yearOfBirth': 2013,
        'footballCoachId': 3,
        'hurlingCoachId': 4,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      },
      {
        'id': 15,
        'previousGroupId': 8,
        'yearId': 3,
        'name': 'Under 7',
        'yearOfBirth': 2012,
        'footballCoachId': 5,
        'hurlingCoachId': 6,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      },
      {
        'id': 16,
        'previousGroupId': 9,
        'yearId': 3,
        'name': 'Under 8',
        'yearOfBirth': 2011,
        'footballCoachId': 7,
        'hurlingCoachId': 8,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      },
      {
        'id': 17,
        'previousGroupId': 10,
        'yearId': 3,
        'name': 'Under 9',
        'yearOfBirth': 2010,
        'footballCoachId': 9,
        'hurlingCoachId': 10,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      },
      {
        'id': 18,
        'previousGroupId': 11,
        'yearId': 3,
        'name': 'Under 10',
        'yearOfBirth': 2009,
        'footballCoachId': 11,
        'hurlingCoachId': 12,
        'createdBy': 'script',
        'createdDate': '2019-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2019-03-15T13:43:51.268Z'
      }
    ];

    this.players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [
      // 2009 players (3 current - 1 missing)
      {
        'id': 1,
        'firstName': 'James',
        'surname': 'Maxwell',
        'addressLine1': '485 Meadowcrest Lane',
        'addressLine2': 'Capitol',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-10-10',
        'medicalConditions': 'Heart Murmur',
        'contactName': 'Kevia Maxwell',
        'contactMobileNumber': '087 3514954',
        'contactHomeNumber': '',
        'contactEmailAddress': 'kevia_maxwell@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 2,
        'firstName': 'Thomas',
        'surname': 'Watkins',
        'addressLine1': '115 Evergreen Lane',
        'addressLine2': 'Richmond',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-05-04',
        'medicalConditions': 'None',
        'contactName': 'Finley Watkins',
        'contactMobileNumber': '086 5882764',
        'contactHomeNumber': '021 4834511',
        'contactEmailAddress': 'finley_watkins@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 3,
        'firstName': 'Joshua',
        'surname': 'Love',
        'addressLine1': '4032 Heliport Loop',
        'addressLine2': 'Gold Cliff',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-06-20',
        'medicalConditions': '',
        'contactName': 'Dilan Love',
        'contactMobileNumber': '087 4765397',
        'contactHomeNumber': '021 9445529',
        'contactEmailAddress': 'dilan_love@hotmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 4,
        'firstName': 'Mark',
        'surname': 'Anderson',
        'addressLine1': '151 Airway Estate',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2009-06-02',
        'medicalConditions': '',
        'contactName': 'Pete Anderson',
        'contactMobileNumber': '087 4852217',
        'contactHomeNumber': '',
        'contactEmailAddress': 'pete_anderson@hotmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      // 2010 players (10 current - 1 missing - 1 gone)
      {
        'id': 5,
        'firstName': 'Joseph',
        'surname': 'Gray',
        'addressLine1': '3893 Conifer Drive',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-09-01',
        'medicalConditions': '',
        'contactName': 'Jarren Gray',
        'contactMobileNumber': '087 6248175',
        'contactHomeNumber': '',
        'contactEmailAddress': 'jarren_gray@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 6,
        'firstName': 'Daniel',
        'surname': 'Hunt',
        'addressLine1': '427 College Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-03-28',
        'medicalConditions': 'Nut Allergy',
        'contactName': 'Welborn Hunt',
        'contactMobileNumber': '087 6467640',
        'contactHomeNumber': '021 7702044',
        'contactEmailAddress': 'welborn_hunt@gmail.com',
        'school': '',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 7,
        'firstName': 'Ethan',
        'surname': 'Gill',
        'addressLine1': '2002 Graystone Lakes',
        'addressLine2': 'Irving',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2010-11-11',
        'medicalConditions': '',
        'contactName': 'Cian Gill',
        'contactMobileNumber': '087 8392576',
        'contactHomeNumber': '021 7925314',
        'contactEmailAddress': 'cian_gill@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 8,
        'firstName': 'Ben',
        'surname': 'Owen',
        'addressLine1': '1320 Broad Street',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-04-08',
        'medicalConditions': 'Asthma',
        'contactName': 'Cola Owen',
        'contactMobileNumber': '087 4105484',
        'contactHomeNumber': '',
        'contactEmailAddress': 'cola_owen@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 9,
        'firstName': 'Sam',
        'surname': 'Bond',
        'addressLine1': '4848 Quilly Lane',
        'addressLine2': 'Whispering Pines',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2010-06-10',
        'medicalConditions': '',
        'contactName': 'Eleri Bond',
        'contactMobileNumber': '087 3683432',
        'contactHomeNumber': '',
        'contactEmailAddress': 'eleri_bond@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 10,
        'firstName': 'Jacob',
        'surname': 'Cohen',
        'addressLine1': '1768 Mulberry Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-10-27',
        'medicalConditions': '',
        'contactName': 'Gordon Cohen',
        'contactMobileNumber': '087 3994863',
        'contactHomeNumber': '',
        'contactEmailAddress': 'gordon_cohen@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 11,
        'firstName': 'Nathan',
        'surname': 'Wells',
        'addressLine1': '2038 Timber Ridge Road',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-05-05',
        'medicalConditions': '',
        'contactName': 'Graysen Wells',
        'contactMobileNumber': '087 7090891',
        'contactHomeNumber': '',
        'contactEmailAddress': 'graysen_wells@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 12,
        'firstName': 'Isaac',
        'surname': 'Powell',
        'addressLine1': '4512 James Street',
        'addressLine2': 'Eagle',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2010-02-13',
        'medicalConditions': '',
        'contactName': 'Bud Powell',
        'contactMobileNumber': '087 3255332',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bud_powell@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 13,
        'firstName': 'Lucas',
        'surname': 'Weaver',
        'addressLine1': '4483 Willis Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-06-06',
        'medicalConditions': '',
        'contactName': 'Val Weaver',
        'contactMobileNumber': '087 5940986',
        'contactHomeNumber': '',
        'contactEmailAddress': 'val_weaver@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 14,
        'firstName': 'Noah',
        'surname': 'Slater',
        'addressLine1': '3703  Cunningham Court',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-07-21',
        'medicalConditions': '',
        'contactName': 'Harry Slater',
        'contactMobileNumber': '087 3165674',
        'contactHomeNumber': '',
        'contactEmailAddress': 'harry_slater@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 15,
        'firstName': 'Evan',
        'surname': 'Kelleher',
        'addressLine1': '10 Greenhills Court',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-04-29',
        'medicalConditions': '',
        'contactName': 'Mike Kelleher',
        'contactMobileNumber': '087 8677213',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mike_kelleher@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 16,
        'firstName': 'Peter',
        'surname': 'Parker',
        'addressLine1': '1001 Spider Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2010-02-27',
        'medicalConditions': '',
        'contactName': 'Mark Parker',
        'contactMobileNumber': '087 6655918',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mark_parker@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      // 2011 players (4 current - 1 missing)
      {
        'id': 17,
        'firstName': 'Luke',
        'surname': 'Stewart',
        'addressLine1': '1035 Harley Brook Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-07-02',
        'medicalConditions': '',
        'contactName': 'Danelle Stewart',
        'contactMobileNumber': '087 9733637',
        'contactHomeNumber': '',
        'contactEmailAddress': 'danelle_stewart@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 18,
        'firstName': 'Matthew',
        'surname': 'Moss',
        'addressLine1': '179 Payne Street',
        'addressLine2': 'Clear Mount',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2011-03-03',
        'medicalConditions': '',
        'contactName': 'Wilder Moss',
        'contactMobileNumber': '087 6186779',
        'contactHomeNumber': '',
        'contactEmailAddress': 'wilder_moss@gmail.com',
        'school': '',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 19,
        'firstName': 'Michael',
        'surname': 'Wolfe',
        'addressLine1': '830 Green Gate Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-11-27',
        'medicalConditions': 'Asthma',
        'contactName': 'Moss Wolfe',
        'contactMobileNumber': '087 7128560',
        'contactHomeNumber': '021 9292476',
        'contactEmailAddress': 'moss_wolfe@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 20,
        'firstName': 'Adam',
        'surname': 'Knowles',
        'addressLine1': '1465 Saint Francis Way',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-12-02',
        'medicalConditions': '',
        'contactName': 'Gruffud Knowles',
        'contactMobileNumber': '087 6182986',
        'contactHomeNumber': '021 9928490',
        'contactEmailAddress': 'gruffud_knowles@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 21,
        'firstName': 'Jimmy',
        'surname': 'White',
        'addressLine1': '147 The Crucible',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2011-12-02',
        'medicalConditions': '',
        'contactName': 'Alan White',
        'contactMobileNumber': '087 4297741',
        'contactHomeNumber': '',
        'contactEmailAddress': 'alan_white@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      // 2012 players (5 current)
      {
        'id': 22,
        'firstName': 'Alex',
        'surname': 'Matthews',
        'addressLine1': '4198 Valley Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': 'Nut Allergy',
        'dateOfBirth': '2012-08-15',
        'medicalConditions': '',
        'contactName': 'Lorene Matthews',
        'contactMobileNumber': '087 4644456',
        'contactHomeNumber': '021 9376713',
        'contactEmailAddress': 'lorene_matthews@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 23,
        'firstName': 'Andrew',
        'surname': 'Sanders',
        'addressLine1': '1225 Morningview Lane',
        'addressLine2': 'Little Cedar',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2012-10-24',
        'medicalConditions': '',
        'contactName': 'West Sanders',
        'contactMobileNumber': '087 8085200',
        'contactHomeNumber': '',
        'contactEmailAddress': 'west_sanders@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 24,
        'firstName': 'David',
        'surname': 'Howard',
        'addressLine1': '657 Richland Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-08-31',
        'medicalConditions': '',
        'contactName': 'Mark Howard',
        'contactMobileNumber': '087 3261389',
        'contactHomeNumber': '',
        'contactEmailAddress': 'mark_howard@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 25,
        'firstName': 'Peter',
        'surname': 'Rowland',
        'addressLine1': '374 Findley Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-06-30',
        'medicalConditions': '',
        'contactName': 'Jerren Rowland',
        'contactMobileNumber': '087 3720760',
        'contactHomeNumber': '',
        'contactEmailAddress': 'jerren_rowland@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 26,
        'firstName': 'Jason',
        'surname': 'Stevenson',
        'addressLine1': '1509 Scenic Way',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2012-06-20',
        'medicalConditions': 'Asthma',
        'contactName': 'Clare Stevenson',
        'contactMobileNumber': '087 8719730',
        'contactHomeNumber': '',
        'contactEmailAddress': 'clare_stevenson@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      // 2013 players (3 current)
      {
        'id': 27,
        'firstName': 'Joel',
        'surname': 'Jacobs',
        'addressLine1': '2547 Harvest Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2013-05-09',
        'medicalConditions': '',
        'contactName': 'Dusty Jacobs',
        'contactMobileNumber': '087 6669515',
        'contactHomeNumber': '',
        'contactEmailAddress': 'dusty_jacobs@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 28,
        'firstName': 'Zach',
        'surname': 'Adams',
        'addressLine1': '3235 Woodridge Lane',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2013-04-10',
        'medicalConditions': 'Dyslexia',
        'contactName': 'Colton Adams',
        'contactMobileNumber': '087 6012884',
        'contactHomeNumber': '021 7048648',
        'contactEmailAddress': 'colton_adams@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 29,
        'firstName': 'Ricky',
        'surname': 'Fox',
        'addressLine1': '3486 Nickel Road',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2013-11-07',
        'medicalConditions': '',
        'contactName': 'Peter Fox',
        'contactMobileNumber': '087 6518787',
        'contactHomeNumber': '',
        'contactEmailAddress': 'peter_fox@gmail.com',
        'school': 'Scoil Mhuire Lourdes',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      // 2014 players (4 current)
      {
        'id': 30,
        'firstName': 'Daithi',
        'surname': 'Greenwood',
        'addressLine1': '447 Sardis Station',
        'addressLine2': 'Edgar',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2014-05-12',
        'medicalConditions': 'Asthma',
        'contactName': 'Bob Greenwood',
        'contactMobileNumber': '087 3556729',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bob_greenwood@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-05-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 31,
        'firstName': 'Bobby',
        'surname': 'Morrison',
        'addressLine1': '1551 University Street',
        'addressLine2': 'Drainer',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2014-09-15',
        'medicalConditions': '',
        'contactName': 'Jim Morrison',
        'contactMobileNumber': '087 3321026',
        'contactHomeNumber': '021 8384692',
        'contactEmailAddress': 'jim_morrison@gmail.com',
        'school': '',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 32,
        'firstName': 'Morgan',
        'surname': 'Booth',
        'addressLine1': '790 Jacobs Street',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2014-10-20',
        'medicalConditions': '',
        'contactName': 'Watts Booth',
        'contactMobileNumber': '087 4678838',
        'contactHomeNumber': '021 6175523',
        'contactEmailAddress': 'watts_booth@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 33,
        'firstName': 'Mike',
        'surname': 'Warren',
        'addressLine1': '3595 Linden Avenue',
        'addressLine2': 'Carrigaline',
        'addressLine3': '',
        'dateOfBirth': '2014-03-17',
        'medicalConditions': '',
        'contactName': 'Bronwyn Warren',
        'contactMobileNumber': '087 7443100',
        'contactHomeNumber': '',
        'contactEmailAddress': 'bronwyn_warren@gmail.com',
        'school': 'Gaelscoil',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      }
    ]

    this.groupsPlayers = JSON.parse(localStorage.getItem(GROUPS_PLAYERS_KEY)) || [
      {
        'id': 1,
        'groupId': 1,
        'playerId': 22,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 2,
        'groupId': 1,
        'playerId': 23,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 3,
        'groupId': 1,
        'playerId': 24,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 4,
        'groupId': 1,
        'playerId': 25,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 5,
        'groupId': 1,
        'playerId': 26,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 6,
        'groupId': 2,
        'playerId': 17,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-16T13:43:51.268Z'
      },
      {
        'id': 7,
        'groupId': 2,
        'playerId': 18,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 8,
        'groupId': 2,
        'playerId': 19,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 9,
        'groupId': 2,
        'playerId': 20,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-16T13:43:51.268Z'
      },
      {
        'id': 10,
        'groupId': 2,
        'playerId': 21,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 11,
        'groupId': 3,
        'playerId': 5,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 12,
        'groupId': 3,
        'playerId': 6,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 13,
        'groupId': 3,
        'playerId': 7,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 14,
        'groupId': 3,
        'playerId': 8,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 15,
        'groupId': 3,
        'playerId': 9,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 16,
        'groupId': 3,
        'playerId': 10,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 17,
        'groupId': 3,
        'playerId': 11,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 18,
        'groupId': 3,
        'playerId': 12,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 19,
        'groupId': 3,
        'playerId': 13,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 20,
        'groupId': 3,
        'playerId': 14,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 21,
        'groupId': 3,
        'playerId': 15,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 22,
        'groupId': 3,
        'playerId': 16,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 23,
        'groupId': 4,
        'playerId': 1,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 24,
        'groupId': 4,
        'playerId': 2,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 25,
        'groupId': 4,
        'playerId': 3,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 26,
        'groupId': 4,
        'playerId': 4,
        'registeredDate': '2017-03-15',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2017-03-15T13:43:51.268Z'
      },
      {
        'id': 27,
        'groupId': 7,
        'playerId': 27,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 28,
        'groupId': 7,
        'playerId': 28,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 29,
        'groupId': 7,
        'playerId': 29,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 30,
        'groupId': 8,
        'playerId': 22,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 31,
        'groupId': 8,
        'playerId': 23,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 32,
        'groupId': 8,
        'playerId': 24,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 33,
        'groupId': 8,
        'playerId': 25,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 34,
        'groupId': 8,
        'playerId': 26,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 35,
        'groupId': 9,
        'playerId': 17,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 36,
        'groupId': 9,
        'playerId': 18,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 37,
        'groupId': 9,
        'playerId': 19,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 38,
        'groupId': 9,
        'playerId': 20,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 39,
        'groupId': 9,
        'playerId': 21,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 40,
        'groupId': 10,
        'playerId': 5,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 41,
        'groupId': 10,
        'playerId': 6,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 42,
        'groupId': 10,
        'playerId': 7,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 43,
        'groupId': 10,
        'playerId': 8,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 44,
        'groupId': 10,
        'playerId': 9,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 45,
        'groupId': 10,
        'playerId': 10,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 46,
        'groupId': 10,
        'playerId': 11,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 47,
        'groupId': 10,
        'playerId': 12,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 48,
        'groupId': 10,
        'playerId': 13,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 49,
        'groupId': 10,
        'playerId': 14,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 50,
        'groupId': 10,
        'playerId': 15,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 51,
        'groupId': 11,
        'playerId': 1,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 52,
        'groupId': 11,
        'playerId': 2,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 53,
        'groupId': 11,
        'playerId': 3,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 54,
        'groupId': 11,
        'playerId': 4,
        'registeredDate': '2018-03-16',
        'createdBy': 'script',
        'createdDate': '2018-03-16T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-03-16T13:43:51.268Z'
      },
      {
        'id': 55,
        'groupId': 13,
        'playerId': 30,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 56,
        'groupId': 13,
        'playerId': 31,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 57,
        'groupId': 13,
        'playerId': 32,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 58,
        'groupId': 13,
        'playerId': 33,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 59,
        'groupId': 14,
        'playerId': 27,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 60,
        'groupId': 14,
        'playerId': 28,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 61,
        'groupId': 14,
        'playerId': 29,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 62,
        'groupId': 15,
        'playerId': 22,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 63,
        'groupId': 15,
        'playerId': 23,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 64,
        'groupId': 15,
        'playerId': 24,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 65,
        'groupId': 15,
        'playerId': 25,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 66,
        'groupId': 15,
        'playerId': 26,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 67,
        'groupId': 16,
        'playerId': 17,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 68,
        'groupId': 16,
        'playerId': 18,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 69,
        'groupId': 16,
        'playerId': 19,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 70,
        'groupId': 16,
        'playerId': 20,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 71,
        'groupId': 17,
        'playerId': 5,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 72,
        'groupId': 17,
        'playerId': 6,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 73,
        'groupId': 17,
        'playerId': 7,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 74,
        'groupId': 17,
        'playerId': 8,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 75,
        'groupId': 17,
        'playerId': 9,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 76,
        'groupId': 17,
        'playerId': 10,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 77,
        'groupId': 17,
        'playerId': 11,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 78,
        'groupId': 17,
        'playerId': 12,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 79,
        'groupId': 17,
        'playerId': 13,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 80,
        'groupId': 17,
        'playerId': 14,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 81,
        'groupId': 18,
        'playerId': 1,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 82,
        'groupId': 18,
        'playerId': 2,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      },
      {
        'id': 83,
        'groupId': 18,
        'playerId': 3,
        'registeredDate': '2019-02-18',
        'createdBy': 'script',
        'createdDate': '2018-02-18T13:43:51.268Z',
        'updatedBy': null,
        'updatedDate': null,
        'version': '2018-02-18T13:43:51.268Z'
      }
    ];

    this.currentYear = this.years.reduce((previous, current) => {
      return (previous.year > current.year) ? previous : current
    });

    this.coachesCoachIdMap = new Map<number, ICoach>();
    this.coaches.forEach(coach => {
      this.coachesCoachIdMap.set(coach.id, coach);

      if (coach.id > this.maxCoachesId) {
        this.maxCoachesId = coach.id;
      }
    });

    this.groupsGroupIdMap = new Map<number, IGroup>();
    this.groups.forEach(group => {
      this.groupsGroupIdMap.set(group.id, group);

      if (group.id > this.maxGroupsId) {
        this.maxGroupsId = group.id;
      }
    });

    this.currentGroupsFootballCoachIdMap = new Map<number, IGroup[]>();
    this.groups.filter(group => { return group.yearId === this.currentYear.id }).forEach(group => {
      let groupMapValue: IGroup[] = this.currentGroupsFootballCoachIdMap.get(group.footballCoachId);

      if (groupMapValue) {
        groupMapValue.push(group);
      }
      else {
        groupMapValue = new Array(group);
      }

      this.currentGroupsFootballCoachIdMap.set(group.footballCoachId, groupMapValue);
    });

    this.currentGroupsHurlingCoachIdMap = new Map<number, IGroup[]>();
    this.groups.filter(group => { return group.yearId === this.currentYear.id }).forEach(group => {
      let groupMapValue: IGroup[] = this.currentGroupsHurlingCoachIdMap.get(group.hurlingCoachId);

      if (groupMapValue) {
        groupMapValue.push(group);
      }
      else {
        groupMapValue = new Array(group);
      }

      this.currentGroupsHurlingCoachIdMap.set(group.hurlingCoachId, groupMapValue);
    });

    this.playersPlayerIdMap = new Map<number, IPlayer>();
    this.players.forEach(player => {
      this.playersPlayerIdMap.set(player.id, player);

      if (player.id > this.maxPlayersId) {
        this.maxPlayersId = player.id;
      }
    });

    this.playersDateOfBirthMap = new Map<string, IPlayer[]>();
    this.players.forEach(player => {
      let playerMapValue: IPlayer[] = this.playersDateOfBirthMap.get(player.dateOfBirth);

      if (playerMapValue) {
        playerMapValue.push(player);
      }
      else {
        playerMapValue = new Array(player);
      }

      this.playersDateOfBirthMap.set(player.dateOfBirth, playerMapValue);
    });

    this.groupsPlayersPlayerIdMap = new Map<number, IGroupPlayer[]>();
    this.groupsPlayers.forEach(groupPlayer => {
      let groupPlayerMapValue: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(groupPlayer.playerId);

      if (groupPlayerMapValue) {
        groupPlayerMapValue.push(groupPlayer);
      }
      else {
        groupPlayerMapValue = new Array(groupPlayer);
      }

      this.groupsPlayersPlayerIdMap.set(groupPlayer.playerId, groupPlayerMapValue);

      if (groupPlayer.id > this.maxGroupsPlayersId) {
        this.maxGroupsPlayersId = groupPlayer.id;
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null).pipe(
      mergeMap(() => {
        try {
          if (request.url.endsWith('/currentSettings')) {
            let body = {
              currentSettings: {
                year: this.currentYear.year
              }
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/authenticate')) {
            let coach: any = this.coaches.find(coach => {
              return coach.emailAddress === request.body.emailAddress;
            });

            if (!coach) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'User not found'
                  }   
                }
              });
            }

            if (coach.password !== request.body.password) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'Invalid password'
                  }   
                }
              });
            }

            let userProfile = {
              ID: coach.emailAddress,
              fullName: coach.firstName + ' ' + coach.surname,
              isAdministrator: coach.administrator,
              isManager: false,
              groups: [],
              createPasswordProfile: false
            };

            this.groups.forEach(group => {
              if (group.footballCoachId === coach.id || group.hurlingCoachId === coach.id) {
                userProfile.isManager = true;
  
                userProfile.groups.push(group.id);
              }
            });
  
            let issuedTime: number = Math.floor(Date.now() / 1000);

            this.authorizationService.payload = {
              userProfile: userProfile,
              iat: issuedTime,
              exp: issuedTime + (60 * 60)
            }

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: {} }));
          }

          if (request.url.endsWith('/changePassword')) {
            let coach: any = this.coaches.find(coach => {
              return coach.emailAddress === request.body.emailAddress;
            });

            if (!coach) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'User not found'
                  }   
                }
              });
            }

            if (coach.password !== request.body.password) {
              return throwError({ 
                status: 401,
                error: {
                  error: {
                    message: 'Invalid password'
                  }   
                }
              });
            }

            let dateString = (new Date(Date.now())).toISOString();

            coach.password = request.body.newPassword;
            coach.updatedBy = request.body.emailAddress;
            coach.updatedDate = dateString;
            coach.version = dateString;
            
            localStorage.setItem(COACHES_KEY, JSON.stringify(this.coaches));

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: {} }));
          }

          if (request.url.endsWith('/groupSummaries')) {
            let body = {
              groups: JSON.parse(JSON.stringify(this.readGroupSummaries()))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/groups')) {
            let body = {
              groups: JSON.parse(JSON.stringify(this.groups.filter(group => { return group.yearId === this.currentYear.id })))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));          
          }

          if (/.*\/api\/groupDetails\/\d+$/.test(request.url)) {
            let groupId: number = +request.url.substring(request.url.lastIndexOf('/') + 1);

            let body = {
              groupDetails: JSON.parse(JSON.stringify(this.groupsGroupIdMap.get(groupId)))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/createGroup') || request.url.endsWith('/updateGroup')) {
            let group: IGroup = null;
            
            if (!request.body.groupDetails) {
              throw new Error ('groupDetails not found in request');
            }

            let currentDate = (new Date(Date.now())).toISOString();

            if (request.url.endsWith('/updateGroup')) {
              group = this.groupsGroupIdMap.get(request.body.groupDetails.id);
            }
            else {
              let existingGroupDetails: IGroup = this.groups.find(group => {
                return group.yearId === this.currentYear.id &&
                  group.name === request.body.groupDetails.name;
              });

              if (existingGroupDetails) {
                let alertService: AlertService = this.injector.get(AlertService);

                alertService.error('Fake HTTP 500 Response', 'Fake duplicate key error collection: CarraigOgRegister.groups index: groups_year_id_name_idx');

                return;
              }

              group = <IGroup>{};

              group.id = ++this.maxGroupsId;

              group.previousGroupId = 0;
              group.yearId = this.currentYear.id;

              group.createdDate = currentDate;
              group.createdBy = this.authorizationService.payload.userProfile.ID;

              this.groups.push(group);
            }
            
            group.yearOfBirth = request.body.groupDetails.yearOfBirth;
            group.name = request.body.groupDetails.name;
            group.footballCoachId = request.body.groupDetails.footballCoachId;
            group.hurlingCoachId = request.body.groupDetails.hurlingCoachId;
            
            group.updatedDate = currentDate;
            group.updatedBy = this.authorizationService.payload.userProfile.ID;

            group.version = currentDate;

            localStorage.setItem(GROUPS_KEY, JSON.stringify(this.groups));

            this.groupsGroupIdMap.set(group.id, group);

            if (group.footballCoachId) {
              let groupMapValue: IGroup[] = this.currentGroupsFootballCoachIdMap.get(group.footballCoachId);
        
              // If we're in update mode the groupMapValue, for this coach, may already include this group.
              if (groupMapValue && !groupMapValue.includes(group)) {
                groupMapValue.push(group);
              }
              else {
                groupMapValue = new Array(group);
              }
        
              this.currentGroupsFootballCoachIdMap.set(group.footballCoachId, groupMapValue);
            }

            if (group.hurlingCoachId) {
              let groupMapValue: IGroup[] = this.currentGroupsHurlingCoachIdMap.get(group.hurlingCoachId);
        
              if (groupMapValue && !groupMapValue.includes(group)) {
                groupMapValue.push(group);
              }
              else {
                groupMapValue = new Array(group);
              }
        
              this.currentGroupsHurlingCoachIdMap.set(group.hurlingCoachId, groupMapValue);
            }

            let body = {
              groups: JSON.parse(JSON.stringify(this.readGroupSummaries()))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));          
          }

          if (request.url.endsWith('/deleteGroup')) {
            if (!request.body.groupSummary) {
              throw new Error ('groupSummary not found in request');
            }
      
            let group: IGroup = this.groupsGroupIdMap.get(request.body.groupSummary.id);

            remove(this.groups, groupToRemove => { return groupToRemove.id === request.body.groupSummary.id });

            localStorage.setItem(GROUPS_KEY, JSON.stringify(this.groups));

            this.groupsGroupIdMap.delete(request.body.groupSummary.id);
            
            if (group.footballCoachId) {
              let groupMapValue: IGroup[] = this.currentGroupsFootballCoachIdMap.get(group.footballCoachId);

              remove(groupMapValue, groupToRemove => { return groupToRemove.id === group.id });

              if (groupMapValue.length === 0) {
                this.currentGroupsFootballCoachIdMap.delete(group.footballCoachId);
              }
            }
            if (group.hurlingCoachId) {
              let groupMapValue: IGroup[] = this.currentGroupsHurlingCoachIdMap.get(group.hurlingCoachId);

              remove(groupMapValue, groupToRemove => { return groupToRemove.id === group.id });

              if (groupMapValue.length === 0) {
                this.currentGroupsHurlingCoachIdMap.delete(group.footballCoachId);
              }
            }

            let body = {
              groups: JSON.parse(JSON.stringify(this.readGroupSummaries()))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));          
          }

          if (/.*\/api\/playerSummaries\/\d+$/.test(request.url)) {
            let groupId: number = +request.url.substring(request.url.lastIndexOf('/') + 1),
                players: any[] = new Array();

            let group: IGroup = this.groupsGroupIdMap.get(groupId);

            let groupPlayersPlayerIdMap: Map<number, IGroupPlayer> = new Map<number, IGroupPlayer>();
            this.groupsPlayers
              .filter(groupPlayer => { 
                return groupPlayer.groupId === groupId;
              })
              .forEach(groupPlayer => {
                groupPlayersPlayerIdMap.set(groupPlayer.playerId, groupPlayer);
              });
        
            let previousGroupPlayersPlayerIdMap: Map<number, IGroupPlayer> = null;
            if (group.previousGroupId) {
              previousGroupPlayersPlayerIdMap = new Map<number, IGroupPlayer>();
              this.groupsPlayers
                .filter(groupPlayer => { 
                  return groupPlayer.groupId === group.previousGroupId;
                })
                .forEach(groupPlayer => {
                  previousGroupPlayersPlayerIdMap.set(groupPlayer.playerId, groupPlayer);
                });
            }

            groupPlayersPlayerIdMap.forEach(groupPlayer => {
              let player: any = this.players.find(player => {
                return groupPlayer.playerId === player.id;
              });

              player = clone(player);

              player.lastRegisteredDate = groupPlayer.registeredDate;

              if (!previousGroupPlayersPlayerIdMap) {
                player.playerState = PlayerState.New;
              }
              else {
                if (previousGroupPlayersPlayerIdMap.get(player.id)) {
                  player.playerState = PlayerState.Existing;
                }
                else {
                  player.playerState = PlayerState.New;
                }
              }

              players.push(player);
            });
            
            if (previousGroupPlayersPlayerIdMap) {
              previousGroupPlayersPlayerIdMap.forEach(groupPlayer => {
                let player: any = this.players.find(player => {
                  return groupPlayer.playerId === player.id;
                });

                if (!groupPlayersPlayerIdMap.get(player.id)) {
                  player = clone(player);

                  player.lastRegisteredDate = groupPlayer.registeredDate;

                  player.playerState = PlayerState.Missing;
  
                  players.push(player);
                }
              });  
            }

            let body = {
              players: JSON.parse(JSON.stringify(players))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (/.*\/api\/searchPlayers\/\d{4}-\d{2}-\d{2}$/.test(request.url)) {
            let body = {
              players: JSON.parse(JSON.stringify(this.searchPlayers(request.url.substring(request.url.lastIndexOf('/') + 1))))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (/.*\/api\/playerDetails\/\d+$/.test(request.url)) {
            let playerId: number = +request.url.substring(request.url.lastIndexOf('/') + 1),
                playerDetails: IPlayer = this.playersPlayerIdMap.get(playerId),
                groupsPlayersForPlayer: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(playerId),
                currentGroupsPlayers: IGroupPlayer = null;

            if (groupsPlayersForPlayer) {
              groupsPlayersForPlayer.forEach(groupsPlayers => {
                let playerGroup: IGroup = this.groupsGroupIdMap.get(groupsPlayers.groupId);

                if (playerGroup.yearId === this.currentYear.id) {
                  currentGroupsPlayers = groupsPlayers;
                }
              });
            }

            let body: any = {
              playerDetails: JSON.parse(JSON.stringify(playerDetails)),
            };

            if (currentGroupsPlayers) {
              body.groupPlayerDetails = JSON.parse(JSON.stringify(currentGroupsPlayers))
            }

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/createPlayer')) {
            let player: IPlayer = null,
                groupPlayer: IGroupPlayer = null;

            if (!(request.body.playerDetails && request.body.groupPlayerDetails)) {
              throw new Error ('playerDetails and groupPlayerDetails not found in request');
            }
          
            let currentDate = (new Date(Date.now())).toISOString();

            let existingPlayerDetails: IPlayer = this.players.find(player => {
              return player.dateOfBirth === request.body.playerDetails.dateOfBirth &&
                player.firstName === request.body.playerDetails.firstName &&
                player.surname === request.body.playerDetails.surname;
            });

            if (existingPlayerDetails) {
              let alertService: AlertService = this.injector.get(AlertService);

              alertService.error('Fake HTTP 500 Response', 'Fake duplicate key error collection: CarraigOgRegister.players index: players_first_name_surname_date_of_birth_idx');

              return;
            }

            player = <IPlayer>{};

            player.id = ++this.maxPlayersId;

            player.firstName = request.body.playerDetails.firstName;
            player.surname = request.body.playerDetails.surname;
            
            player.dateOfBirth = request.body.playerDetails.dateOfBirth;

            player.addressLine1 = request.body.playerDetails.addressLine1;
            player.addressLine2 = request.body.playerDetails.addressLine2;
            player.addressLine3 = request.body.playerDetails.addressLine3;
            player.medicalConditions = request.body.playerDetails.medicalConditions;
            player.contactName = request.body.playerDetails.contactName;
            player.contactHomeNumber = request.body.playerDetails.contactHomeNumber;
            player.contactMobileNumber = request.body.playerDetails.contactMobileNumber;
            player.contactEmailAddress = request.body.playerDetails.contactEmailAddress;
            player.school = request.body.playerDetails.school;
    
            player.createdDate = currentDate;
            player.createdBy = this.authorizationService.payload.userProfile.ID;

            player.version = currentDate;

            this.players.push(player);
            
            localStorage.setItem(PLAYERS_KEY, JSON.stringify(this.players));

            this.playersPlayerIdMap.set(player.id, player);

            let playerMapValue: IPlayer[] = this.playersDateOfBirthMap.get(player.dateOfBirth);

            if (playerMapValue) {
              playerMapValue.push(player);
            }
            else {
              playerMapValue = new Array(player);
            }
      
            this.playersDateOfBirthMap.set(player.dateOfBirth, playerMapValue);
      
            groupPlayer = <IGroupPlayer>{};

            groupPlayer.id = ++this.maxGroupsPlayersId;

            groupPlayer.groupId = request.body.groupPlayerDetails.groupId;
            groupPlayer.playerId = player.id;
            
            groupPlayer.registeredDate = request.body.groupPlayerDetails.registeredDate;
    
            groupPlayer.createdDate = currentDate;
            groupPlayer.createdBy = this.authorizationService.payload.userProfile.ID;

            groupPlayer.version = currentDate;

            this.groupsPlayers.push(groupPlayer);
            
            localStorage.setItem(GROUPS_PLAYERS_KEY, JSON.stringify(this.groupsPlayers));

            let groupPlayerMapValue: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(player.id);

            if (groupPlayerMapValue) {
              groupPlayerMapValue.push(groupPlayer);
            }
            else {
              groupPlayerMapValue = new Array(groupPlayer);
            }
      
            this.groupsPlayersPlayerIdMap.set(groupPlayer.playerId, groupPlayerMapValue);
      
            let body = {
              players: JSON.parse(JSON.stringify(this.searchPlayers(player.dateOfBirth)))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/updatePlayer')) {
            if (!(request.body.playerDetails || request.body.groupPlayerDetails)) {
              throw new Error ('playerDetails or groupPlayerDetails not found in request');
            }

            let currentDate = (new Date(Date.now())).toISOString();

            if (request.body.playerDetails) {
              let player: IPlayer = this.playersPlayerIdMap.get(request.body.playerDetails.id);

              let oldDateOfBirth: string = null;
 
              player.firstName = request.body.playerDetails.firstName;
              player.surname = request.body.playerDetails.surname;
              
              if (player.dateOfBirth !== request.body.playerDetails.dateOfBirth) {
                oldDateOfBirth = player.dateOfBirth;
              }
              player.dateOfBirth = request.body.playerDetails.dateOfBirth;

              player.addressLine1 = request.body.playerDetails.addressLine1;
              player.addressLine2 = request.body.playerDetails.addressLine2;
              player.addressLine3 = request.body.playerDetails.addressLine3;
              player.medicalConditions = request.body.playerDetails.medicalConditions;
              player.contactName = request.body.playerDetails.contactName;
              player.contactHomeNumber = request.body.playerDetails.contactHomeNumber;
              player.contactMobileNumber = request.body.playerDetails.contactMobileNumber;
              player.contactEmailAddress = request.body.playerDetails.contactEmailAddress;
              player.school = request.body.playerDetails.school;
      
              player.updatedDate = currentDate;
              player.updatedBy = this.authorizationService.payload.userProfile.ID;

              player.version = currentDate;

              localStorage.setItem(PLAYERS_KEY, JSON.stringify(this.players));

              if (oldDateOfBirth) {
                let playerMapValue: IPlayer[] = this.playersDateOfBirthMap.get(oldDateOfBirth);

                remove(playerMapValue, playerToRemove => { return playerToRemove.id === player.id });

                if (playerMapValue.length === 0) {
                  this.playersDateOfBirthMap.delete(oldDateOfBirth);
                }

                playerMapValue = this.playersDateOfBirthMap.get(player.dateOfBirth);

                if (playerMapValue) {
                  playerMapValue.push(player);
                }
                else {
                  playerMapValue = new Array(player);
                }
          
                this.playersDateOfBirthMap.set(player.dateOfBirth, playerMapValue);  
              }
            }

            if (request.body.groupPlayerDetails) {
              let groupPlayer: IGroupPlayer = null;

              if (!request.body.groupPlayerDetails.id) {
                groupPlayer = <IGroupPlayer>{};

                groupPlayer.id = ++this.maxGroupsPlayersId;
    
                groupPlayer.groupId = request.body.groupPlayerDetails.groupId;
                groupPlayer.playerId = request.body.groupPlayerDetails.playerId;
                
                groupPlayer.registeredDate = request.body.groupPlayerDetails.registeredDate;
        
                groupPlayer.createdDate = currentDate;
                groupPlayer.createdBy = this.authorizationService.payload.userProfile.ID;
    
                groupPlayer.version = currentDate;
    
                this.groupsPlayers.push(groupPlayer);
                
                localStorage.setItem(GROUPS_PLAYERS_KEY, JSON.stringify(this.groupsPlayers));
    
                let groupPlayerMapValue: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(groupPlayer.playerId);
    
                if (groupPlayerMapValue) {
                  groupPlayerMapValue.push(groupPlayer);
                }
                else {
                  groupPlayerMapValue = new Array(groupPlayer);
                }
          
                this.groupsPlayersPlayerIdMap.set(groupPlayer.playerId, groupPlayerMapValue);
              }
              else {
                if (request.body.groupPlayerDetails.groupId !== -1) {
                  let groupPlayerMapValue: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(request.body.groupPlayerDetails.playerId),
                      groupPlayer: IGroupPlayer = null;

                  for (let groupsPlayers of groupPlayerMapValue) {
                    let playerGroup: IGroup = this.groupsGroupIdMap.get(groupsPlayers.groupId);
      
                    if (playerGroup.yearId === this.currentYear.id) {
                      groupPlayer = groupsPlayers;

                      break;
                    }
                  }

                  groupPlayer.groupId = request.body.groupPlayerDetails.groupId;
                  
                  groupPlayer.registeredDate = request.body.groupPlayerDetails.registeredDate;
          
                  groupPlayer.updatedDate = currentDate;
                  groupPlayer.updatedBy = this.authorizationService.payload.userProfile.ID;
      
                  groupPlayer.version = currentDate;  

                  localStorage.setItem(GROUPS_PLAYERS_KEY, JSON.stringify(this.groupsPlayers));    
                }
                else {
                  remove(this.groupsPlayers, groupsPlayersToRemove => { return groupsPlayersToRemove.id === request.body.groupPlayerDetails.id });
      
                  localStorage.setItem(GROUPS_PLAYERS_KEY, JSON.stringify(this.groupsPlayers));
                  
                  let groupsPlayersMapValue: IGroupPlayer[] = this.groupsPlayersPlayerIdMap.get(request.body.groupPlayerDetails.playerId);

                  let groupsPlayersToRemoveId: number = 0;

                  groupsPlayersMapValue.forEach(groupsPlayers => {
                    let playerGroup: IGroup = this.groupsGroupIdMap.get(groupsPlayers.groupId);
      
                    if (playerGroup.yearId === this.currentYear.id) {
                      groupsPlayersToRemoveId = groupsPlayers.id;
                    }
                  });

                  remove(groupsPlayersMapValue, groupsPlayersToRemove => { return groupsPlayersToRemove.id === groupsPlayersToRemoveId });

                  if (groupsPlayersMapValue.length === 0) {
                    this.groupsPlayersPlayerIdMap.delete(request.body.groupPlayerDetails.playerId);
                  }
                }
              }
            }

            let body = {
              players: JSON.parse(JSON.stringify(this.searchPlayers(request.body.playerDetails.dateOfBirth)))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/coachSummaries')) {
            let coaches: any[] = cloneDeep(this.coaches);

            coaches.forEach(coach => {
              if (this.currentGroupsFootballCoachIdMap.get(coach.id)) {
                coach.active = true;
              }
              else {
                if (this.currentGroupsHurlingCoachIdMap.get(coach.id)) {
                  coach.active = true;
                }
                else {
                  coach.active = false;
                }
              }
            });

            let body = {
              coaches: JSON.parse(JSON.stringify(coaches))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (request.url.endsWith('/coaches')) {
            let body = {
              coaches: JSON.parse(JSON.stringify(this.coaches))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

          if (/.*\/api\/coachDetails\/\d+$/.test(request.url)) {
            let coachId: number = +request.url.substring(request.url.lastIndexOf('/') + 1),
                coachDetails: ICoach = this.coachesCoachIdMap.get(coachId);

            let footballCoachRoles: any[] = this.currentGroupsFootballCoachIdMap.get(coachId);
            if (footballCoachRoles) {
              footballCoachRoles.forEach(coachRole => {
                coachRole.groupName = coachRole.name;
                coachRole.role = 'Football Coach';
              });
            }

            let hurlingCoachRoles: any[] = this.currentGroupsHurlingCoachIdMap.get(coachId);
            if (hurlingCoachRoles) {
              hurlingCoachRoles.forEach(coachRole => {
                coachRole.groupName = coachRole.name;
                coachRole.role = 'Hurling Coach';
              });
            }

            let coachRoles: any[] = null;

            if (footballCoachRoles) {
              if (hurlingCoachRoles) {
                coachRoles = footballCoachRoles.concat(hurlingCoachRoles);
              }
              else {
                coachRoles = footballCoachRoles;
              }
            }
            else {
              coachRoles = hurlingCoachRoles;
            }

            if (coachRoles) {
              coachRoles.sort((a, b) => {
                if (a.groupName > b.groupName) {
                  return -1;
                }
                if (a.groupName < b.groupName) {
                  return 1;
                }
                
                return 0;
              });
            }

            let body = {
              coachDetails: JSON.parse(JSON.stringify(coachDetails)),
              coachRoles: JSON.parse(JSON.stringify(coachRoles))
            };

            return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
          }

//           if (request.url.endsWith('/updateCoach') || request.url.endsWith('/createCoach')) {
//             let coachDetails: ICoach = null;
            
//             if (request.url.endsWith('/updateCoach')) {
//               coachDetails = this.coaches.find(coach => {
//                 return coach._id === request.body.coachDetails._id;
//               });

//               coachDetails.__v++;
//             }
//             else {
//               let existingCoachDetails: ICoach = this.coaches.find(coach => {
//                 return coach.emailAddress === request.body.coachDetails.emailAddress;
//               });

//               if (existingCoachDetails) {
//                 let alertService: AlertService = this.injector.get(AlertService);

//                 alertService.error('Fake HTTP 500 Response', 'Fake duplicate key error collection: CarraigOgRegister.coach index: emailAddress');

//                 return;
//               }

//               coachDetails = <ICoach>{};

//               coachDetails._id = this.generateId();

//               coachDetails.emailAddress = request.body.coachDetails.emailAddress;

//               coachDetails.createdDate = (new Date(Date.now())).toISOString();
//               coachDetails.createdBy = this.authorizationService.payload.userProfile.ID;
  
//               coachDetails.__v = 0;

//               this.coaches.push(coachDetails);
//             }
            
//             coachDetails.firstName = request.body.coachDetails.firstName;
//             coachDetails.surname = request.body.coachDetails.surname;
//             coachDetails.phoneNumber = request.body.coachDetails.phoneNumber;
//             coachDetails.isAdministrator = request.body.coachDetails.isAdministrator;
  
//             coachDetails.updatedDate = (new Date(Date.now())).toISOString();
//             coachDetails.updatedBy = this.authorizationService.payload.userProfile.ID;

//             localStorage.setItem(COACHES_KEY, JSON.stringify(this.coaches));

//             let coaches: ICoach[] = this.readCoaches();

//             let body = {
//               coaches: coaches
//             };

//             return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
//           }

//           if (request.url.endsWith('/deleteCoach')) {
//             let coachDetails: ICoach = request.body.coachDetails;

//             let coachIndex: number = this.coaches.findIndex(coach => {
//               return coach._id === coachDetails._id;
//             });

//             if (coachIndex === -1) {
//               let alertService: AlertService = this.injector.get(AlertService);

//               alertService.error('Fake HTTP 500 Response', 'Fake key not found: CarraigOgRegister.coach _id');

//               return;
//             }

//             if (coachDetails.active) {
//               this.groups.forEach(group => {
//                 if (group.footballCoach === coachDetails.emailAddress) {
//                   group.footballCoach = '';
//                 }
//                 if (group.hurlingCoach === coachDetails.emailAddress) {
//                   group.hurlingCoach = '';
//                 }
//               })

//               localStorage.setItem(GROUPS_KEY, JSON.stringify(this.groups));
//             }

//             this.coaches.splice(coachIndex, 1);
  
//             localStorage.setItem(COACHES_KEY, JSON.stringify(this.coaches));

//             let coaches: ICoach[] = this.readCoaches();

//             let body = {
//               coaches: coaches
//             };

//             return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
//           }

//           if (/.*\/api\/coachGroups\/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(request.url)) {
//             let coachEmailAddress: string = request.url.substring(request.url.lastIndexOf('/') + 1),
//                 coachGroups = [];

//             this.groups.filter(group => { return group.year === this.currentSettings.year}).forEach(group => {
//               if (group.footballCoach === coachEmailAddress) {
//                 let coachGroup: any = {
//                   groupName: group.name,
//                   role: 'Football Coach'
//                 };

//                 coachGroups.push(coachGroup);
//               }
//               if (group.hurlingCoach === coachEmailAddress) {
//                 let coachGroup: any = {
//                   groupName: group.name,
//                   role: 'Hurling Coach'
//                 };

//                 coachGroups.push(coachGroup);
//               }
//             });

//             let body = {
//               coachGroups: coachGroups
//             };

//             return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
//           }

//           if (request.url.endsWith('/updateGroup')) {
//             let groupDetails: IGroup = null;
            
//             groupDetails = this.groups.find(group => {
//               return group._id === request.body.groupDetails._id;
//             });

//             groupDetails.__v++;
            
//             groupDetails.footballCoach = request.body.groupDetails.footballCoach;
//             groupDetails.hurlingCoach = request.body.groupDetails.hurlingCoach;

//             groupDetails.updatedDate = (new Date(Date.now())).toISOString();
//             groupDetails.updatedBy = this.authorizationService.payload.userProfile.ID;

//             localStorage.setItem(GROUPS_KEY, JSON.stringify(this.groups));

//             let body = {
//               groups: this.groups
//             };

//             return of<HttpEvent<any>>(new HttpResponse({ status: 200, body: { body: body }}));
//           }

          if (request.url.endsWith('/writeLog')) {
            return of<HttpEvent<any>>(new HttpResponse({ status: 200 }));
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
      delay(100));
  }

  private readGroupSummaries(): IGroup[] { 
    let groups: any[] = this.groups.filter(group => { 
      return group.yearId === this.currentYear.id;
    });

    groups = cloneDeep(groups);

    groups.forEach(group => {
      let hurlingCoach: ICoach = this.coachesCoachIdMap.get(group.hurlingCoachId);
      if (hurlingCoach) {
        group.hurlingCoachFullName = hurlingCoach.firstName + ' ' + hurlingCoach.surname;
      }
      else {
        group.hurlingCoachFullName = null;
      }

      let footballCoach: ICoach = this.coachesCoachIdMap.get(group.footballCoachId);
      if (footballCoach) {
        group.footballCoachFullName = footballCoach.firstName + ' ' + footballCoach.surname;
      }
      else {
        group.footballCoachFullName = null;
      }

      let groupPlayers: IGroupPlayer[] = this.groupsPlayers.filter(groupPlayer => {
        return groupPlayer.groupId === group.id;
      });

      group.numberOfPlayers = groupPlayers.length;

      let groupLastUpdatedDate: Date = null;

      groupPlayers.forEach(groupPlayer => {
        let player: any = this.playersPlayerIdMap.get(groupPlayer.playerId);

        let playerLastUpdatedDate: Date = null;

        if (player.updatedDate) {
          playerLastUpdatedDate = new Date(player.updatedDate);
        }
        else {
          playerLastUpdatedDate = new Date(player.createdDate);
        }

        if (!groupLastUpdatedDate) {
          groupLastUpdatedDate = playerLastUpdatedDate;
        }
        else {
          if (playerLastUpdatedDate > groupLastUpdatedDate) {
            groupLastUpdatedDate = playerLastUpdatedDate;
          }
        }
      });

      if (groupLastUpdatedDate) {
        group.lastUpdatedDate = moment.utc(groupLastUpdatedDate).add(groupLastUpdatedDate.getTimezoneOffset(), "m").toISOString();
      }
    });

    return groups;
  }

  private searchPlayers(dateOfBirth: string): any[] { 
    let players: any[] = this.playersDateOfBirthMap.get(dateOfBirth);

    if (players) {
      players = cloneDeep(players);

      players.forEach(player => {
        let groupsPlayersForPlayer = this.groupsPlayersPlayerIdMap.get(player.id);

        let mostRecentYear: number = 0,
            secondMostRecentYear: number = 0;

        if (groupsPlayersForPlayer) {
          groupsPlayersForPlayer.forEach(groupPlayer => {
            let playerGroup: IGroup = this.groupsGroupIdMap.get(groupPlayer.groupId);

            if (!mostRecentYear) {
              player.lastRegisteredDate = groupPlayer.registeredDate;

              mostRecentYear = this.years.find(year => { return playerGroup.yearId === year.id }).year;
            }
            else {
              let groupYear: any = this.years.find(year => { return playerGroup.yearId === year.id }).year;

              if (groupYear > mostRecentYear) {
                player.lastRegisteredDate = groupPlayer.registeredDate;

                secondMostRecentYear = mostRecentYear;
                mostRecentYear = groupYear;
              }
            }
          });
        }

        if (this.currentYear.year === mostRecentYear) {
          if (this.currentYear.year - 1 === secondMostRecentYear) {
            player.playerState = PlayerState.Existing;
          }
          else {
            player.playerState = PlayerState.New;
          }
        }
        else {
          if (this.currentYear.year - 1 === mostRecentYear) {
            player.playerState = PlayerState.Missing;
          }
          else {
            player.playerState = PlayerState.Gone;
          }
        }
      });
    }
    else {
      players = new Array();
    }

    return players;
  }
}
