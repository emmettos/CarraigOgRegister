import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});