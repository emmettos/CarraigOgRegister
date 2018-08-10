import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { GroupsService } from '../../_services';

import { GroupsListComponent } from './groups-list.component';


class MockHttpClient {
  get() {}
  post() {}
}

describe('GroupsListComponent', () => {
  let component: GroupsListComponent;
  let fixture: ComponentFixture<GroupsListComponent>;

  let groupsService: GroupsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsListComponent 
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        GroupsService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsListComponent);
    component = fixture.componentInstance;

    groupsService = TestBed.get(GroupsService);
    
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        "error": null,
        "body": {
          "groups": [
            {
              "year": 2018,
              "name": "Under 10",
              "yearOfBirth": 2008,
              "footballManager": "Gerard Murphy",
              "hurlingManager": "Sean Collins",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:38:40.175Z",
              "updatedDate": "2018-02-23T11:38:40.175Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-02-27T15:57:21.582Z",
              "numberOfPlayers": 29
            },
            {
              "year": 2018,
              "name": "Under 9",
              "yearOfBirth": 2009,
              "footballManager": "Dave Riordan",
              "hurlingManager": "Kevin Geary",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:41:11.887Z",
              "updatedDate": "2018-02-23T11:41:11.887Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-07-26T16:29:25.372Z",
              "numberOfPlayers": 42
            },
            {
              "year": 2018,
              "name": "Under 8",
              "yearOfBirth": 2010,
              "footballManager": "Patrick Nagle",
              "hurlingManager": "Patrick Nagle",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:42:25.972Z",
              "updatedDate": "2018-02-23T11:42:25.972Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-02-28T11:22:24.262Z",
              "numberOfPlayers": 29
            },
            {
              "year": 2018,
              "name": "Under 7",
              "yearOfBirth": 2011,
              "footballManager": "Derek Macken",
              "hurlingManager": "Denis Cole",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:43:59.701Z",
              "updatedDate": "2018-02-23T11:43:59.701Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-02-27T16:00:20.439Z",
              "numberOfPlayers": 33
            },
            {
              "year": 2018,
              "name": "Under 6",
              "yearOfBirth": 2012,
              "footballManager": "Bill  O'Sullivan",
              "hurlingManager": "Denis Cole",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:45:03.022Z",
              "updatedDate": "2018-02-23T11:45:03.022Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-02-27T12:20:39.338Z",
              "numberOfPlayers": 42
            },
            {
              "year": 2018,
              "name": "Under 5",
              "yearOfBirth": 2013,
              "footballManager": "someone@gmail.com",
              "hurlingManager": "someone@gmail.com",
              "createdBy": "script",
              "createdDate": "2018-02-23T11:46:04.082Z",
              "updatedDate": "2018-02-23T11:46:04.082Z",
              "updatedBy": "script",
              "lastUpdatedDate": "2018-02-27T12:09:40.660Z",
              "numberOfPlayers": 16
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
