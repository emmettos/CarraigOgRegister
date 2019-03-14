import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroup, IGroupSummary } from '../../_models';
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

  it('should call url for read group summaries', () => {
    service.readGroupSummaries()
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/groupSummaries');

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

  it('should call url for group details', () => {
    service.readGroupDetails(1)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/groupDetails/1');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for create group', () => {
    service.createGroup(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createGroup');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for create group', () => {
    let group: any = {
      'yearId': 1,
      'name': 'Under 10',
      'yearOfBirth': 2008,
      'footballCoachId': 1,
      'hurlingCoachId': 2
    };

    service.createGroup(group)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createGroup');

    expect(mockRequest.request.body).toEqual({
      groupDetails: group
    });

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
      'id': 1,
      'yearId': 1,
      'name': 'Under 10',
      'yearOfBirth': 2008,
      'footballCoachId': 1,
      'hurlingCoachId': 2,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-27T15:57:21.582Z',
      'updatedBy': 'admin@carraigog.com',
      'version': '2018-02-27T15:57:21.582Z'
    };

    service.updateGroup(group)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateGroup');

    expect(mockRequest.request.body).toEqual({
      groupDetails: group
    });

    mockRequest.flush(null);
  });

  it('should call url for delete group', () => {
    service.deleteGroup(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deleteGroup');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for delete group', () => {
    let groupSummary: IGroupSummary = {
      'id': 1,
      'yearOfBirth': 2008,
      'name': 'Under 10',
      'version': '2018-02-04T15:13:00.000Z',
      'footballCoachFullName': 'Angel Klein',
      'hurlingCoachFullName': 'Heddwyn Cunningham',
      'numberOfPlayers': 0,
      'lastUpdatedDate': '2018-02-27T15:57:21.582Z'
    } as IGroupSummary;

    service.deleteGroup(groupSummary)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deleteGroup');

    expect(mockRequest.request.body).toEqual({
      groupSummary: groupSummary
    });

    mockRequest.flush(null);
  });

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});