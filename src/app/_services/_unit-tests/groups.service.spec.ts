import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroup } from '../../_models';
import { GroupsService } from '../index';


describe('GroupsService', () => {
  let httpMock: HttpTestingController;

  let service: GroupsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GroupsService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(GroupsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for read group overviews', () => {
    service.readGroupOverviews()
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/groupOverviews');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for read groups', () => {
    service.readGroups()
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/groups');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for update group', () => {
    service.updateGroup(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateGroup');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for update group', () => {
    let group: IGroup = {
      '_id': 'dfe674827f95ff37765ba0fc',
      'year': 2018,
      'name': 'Under 10',
      'yearOfBirth': 2008,
      'footballCoach': 'angel_klein@carraigog.com',
      'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
      'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-27T15:57:21.582Z',
      'updatedBy': 'admin@carraigog.com',
      '__v': 0,
      'footballCoachFullName': 'Angel Klein',
      'hurlingCoachFullName': 'Heddwyn Cunningham'
    };

    service.updateGroup(group)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateGroup');

    expect(mockRequest.request.body).toEqual({
      groupDetails: {
        '_id': 'dfe674827f95ff37765ba0fc',
        'year': 2018,
        'name': 'Under 10',
        'yearOfBirth': 2008,
        'footballCoach': 'angel_klein@carraigog.com',
        'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
        'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'updatedBy': 'admin@carraigog.com',
        '__v': 0,
        'footballCoachFullName': 'Angel Klein',
        'hurlingCoachFullName': 'Heddwyn Cunningham'
        }
    });

    mockRequest.flush(null);
  });

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});