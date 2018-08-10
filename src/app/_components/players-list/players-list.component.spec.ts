import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PlayersService } from '../../_services';

import { PlayersListComponent } from './players-list.component';


class MockHttpClient {
  get() {}
  post() {}
}

describe('PlayersListComponent', () => {
  let component: PlayersListComponent;
  let fixture: ComponentFixture<PlayersListComponent>;

  let playersService: PlayersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PlayersListComponent 
      ],
      imports: [
        HttpClientModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        PlayersService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersListComponent);
    component = fixture.componentInstance;

    playersService = TestBed.get(PlayersService);

    spyOn(playersService, 'readCurrentPlayers')
      .and.returnValue(of({
        "error": null,
        "body": {
          "players": [
            {
              "_id": "58c669deb8a0ebcf9c5b93c9",
              "firstName": "Jos",
              "surname": "Keating",
              "addressLine1": "Leela Hill House",
              "addressLine2": "KnockNaLurgan",
              "addressLine3": "Carrigaline",
              "dateOfBirth": "2009-01-01T00:00:00.000Z",
              "yearOfBirth": 2009,
              "medicalConditions": "",
              "contactName": "David Keating",
              "contactMobileNumber": "087 6874814",
              "contactHomeNumber": "",
              "contactEmailAddress": "keatingdavidj@gmail.com",
              "school": "",
              "lastRegisteredDate": "2017-05-08T23:00:00.000Z",
              "lastRegisteredYear": 2017,
              "registeredYears": [
                  2016,
                  2017
              ],
              "__v": 1,
              "createdBy": "script",
              "createdDate": "2017-03-15T13:43:51.268Z",
              "updatedDate": "2017-05-09T09:55:59.735Z",
              "updatedBy": "emmett.j.osullivan@gmail.com"
            },
            {
              "_id": "58c669deb8a0ebcf9c5b93cb",
              "firstName": "Charlie",
              "surname": "Kennedy",
              "addressLine1": "7 The Orchard",
              "addressLine2": "Herons Wood",
              "addressLine3": "Carrigaline",
              "dateOfBirth": "2009-01-01T00:00:00.000Z",
              "yearOfBirth": 2009,
              "medicalConditions": "",
              "contactName": "Shane Kennedy",
              "contactMobileNumber": "086 8104453",
              "contactHomeNumber": "021 4834511",
              "contactEmailAddress": "shanekennedy7@gmail.com",
              "school": "",
              "lastRegisteredDate": "2018-02-17T00:00:00.000Z",
              "lastRegisteredYear": 2018,
              "registeredYears": [
                  2016,
                  2017,
                  2018
              ],
              "__v": 2,
              "createdBy": "script",
              "createdDate": "2017-03-15T13:43:51.268Z",
              "updatedDate": "2018-02-23T15:14:53.115Z",
              "updatedBy": "emmett.j.osullivan@gmail.com"
            },
            {
              "_id": "58c669deb8a0ebcf9c5b93dc",
              "firstName": "Eoghan",
              "surname": "Ahern",
              "addressLine1": "5 Owenabue Drive",
              "addressLine2": "Carrigaline",
              "addressLine3": "",
              "dateOfBirth": "2009-10-10T00:00:00.000Z",
              "yearOfBirth": 2009,
              "medicalConditions": "",
              "contactName": "Therese Ahern",
              "contactMobileNumber": "087 9564971",
              "contactHomeNumber": "086 3917516",
              "contactEmailAddress": "thereseaherne@gmail.com",
              "school": "Scoil Mhuire Lourdes",
              "lastRegisteredDate": "2018-02-17T00:00:00.000Z",
              "lastRegisteredYear": 2018,
              "registeredYears": [
                  2015,
                  2016,
                  2017,
                  2018
              ],
              "__v": 2,
              "createdBy": "script",
              "createdDate": "2017-03-15T13:43:51.268Z",
              "updatedDate": "2018-02-23T14:21:46.480Z",
              "updatedBy": "emmett.j.osullivan@gmail.com"
            },
            {
              "_id": "58c669deb8a0ebcf9c5b93dd",
              "firstName": "Cian",
              "surname": "Aherne",
              "addressLine1": "Cois Dara",
              "addressLine2": "Raheens",
              "addressLine3": "Carrigaline",
              "dateOfBirth": "2009-03-20T00:00:00.000Z",
              "yearOfBirth": 2009,
              "medicalConditions": "",
              "contactName": "Maria Aherne",
              "contactMobileNumber": "087 4128709",
              "contactHomeNumber": "021 4379489",
              "contactEmailAddress": "mobrien_tara@hotmail.com",
              "school": "Gaelscoil",
              "lastRegisteredDate": "2017-02-04T00:00:00.000Z",
              "lastRegisteredYear": 2017,
              "registeredYears": [
                  2016,
                  2017
              ],
              "__v": 1,
              "createdBy": "script",
              "createdDate": "2017-03-15T13:43:51.268Z",
              "updatedDate": "2017-04-13T14:38:36.668Z",
              "updatedBy": "emmett.j.osullivan@gmail.com"
            }
          ]
        }  
      }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
