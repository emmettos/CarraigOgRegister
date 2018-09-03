import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GroupsService } from './index';


describe('PlayersService', () => {
  let httpMock: HttpTestingController;

  let service: GroupsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(GroupsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for read groups', () => {
    service.readGroups()
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/groups');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });
});