import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { APP_SETTINGS } from '../../_helpers/index';
import { GroupsService } from '../../_services';

import { GroupsListComponent } from './groups-list.component';


describe('GroupsListComponent', () => {
  let component: GroupsListComponent;
  let fixture: ComponentFixture<GroupsListComponent>;

  APP_SETTINGS.currentYear = 2018;

  let groupsService: GroupsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsListComponent 
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
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
    
    spyOn(groupsService, 'readGroupSummaries')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': [
            {
              'year': 2018,
              'name': 'Under 10',
              'yearOfBirth': 2008,
              'footballCoach': 'Football 2008',
              'hurlingCoach': 'HUrling 2008',
              'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
              'numberOfPlayers': 29
            },
            {
              'year': 2018,
              'name': 'Under 9',
              'yearOfBirth': 2009,
              'footballCoach': 'Football 2009',
              'hurlingCoach': 'Hurling 2009',
              'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
              'numberOfPlayers': 42
            },
            {
              'year': 2018,
              'name': 'Under 8',
              'yearOfBirth': 2010,
              'footballCoach': 'Football 2010',
              'hurlingCoach': 'Hurling 2010',
              'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
              'numberOfPlayers': 29
            },
            {
              'year': 2018,
              'name': 'Under 7',
              'yearOfBirth': 2011,
              'footballCoach': 'Football 2011',
              'hurlingCoach': 'Hurling 2011',
              'lastUpdatedDate': '2018-02-27T16:00:20.439Z',
              'numberOfPlayers': 33
            },
            {
              'year': 2018,
              'name': 'Under 6',
              'yearOfBirth': 2012,
              'footballCoach': 'Football 2012',
              'hurlingCoach': 'Hurling 2012',
              'lastUpdatedDate': '2018-02-27T12:20:39.338Z',
              'numberOfPlayers': 42
            },
            {
              'year': 2018,
              'name': 'Under 5',
              'yearOfBirth': 2013,
              'footballCoach': 'Football 2013',
              'hurlingCoach': 'Hurling 2013',
              'lastUpdatedDate': '2018-02-27T12:09:40.660Z',
              'numberOfPlayers': 16
            }
          ]
        }
      }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call groupsService.readGroupSummaries', () => {
    expect(groupsService.readGroupSummaries).toHaveBeenCalled();
  });

  it('should display header', () => {
    expect(fixture.nativeElement.querySelector('#header > label').innerHTML).toEqual('2018 Carraig Og Groups');
  });

  it('should display first group', () => {
    expect(fixture.nativeElement.querySelector('#group-summaries > div:nth-child(1) > app-group-thumbnail')).toBeTruthy();
  });

  it('should display last group', () => {
    expect(fixture.nativeElement.querySelector('#group-summaries > div:nth-child(6) > app-group-thumbnail')).toBeTruthy();
  });
});
