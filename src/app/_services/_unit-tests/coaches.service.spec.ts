import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICoach } from '../../_models';
import { CoachesService } from '../index';


describe('CoachesService', () => {
  let httpMock: HttpTestingController;

  let service: CoachesService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoachesService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(CoachesService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for read coaches', () => {
    service.readCoaches()
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/coaches');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush(null);
  });

  it('should call url for update coach', () => {
    service.updateCoach(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateCoach');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for update coach', () => {
    let coach: ICoach = {
      '_id': 'b093d6d273adfb49ae33e6e1',
      'firstName': 'Administrator',
      'surname': '',
      'emailAddress': 'admin@carraigog.com',
      'phoneNumber': '086 1550344',
      'isAdministrator': true,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'admin@carraigog.com',
      '__v': 0,
      'active': false,
      'currentSessionOwner': true
    }

    service.updateCoach(coach)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateCoach');

    expect(mockRequest.request.body).toEqual({
      coachDetails: {
        '_id': 'b093d6d273adfb49ae33e6e1',
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'admin@carraigog.com',
        '__v': 0,
        'active': false,
        'currentSessionOwner': true
      }
    });

    mockRequest.flush(null);
  });

  it('should call url for create coach', () => {
    service.createCoach(null)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/createCoach');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for create coach', () => {
    let coach: any = {
      'firstName': 'Administrator',
      'surname': '',
      'emailAddress': 'admin@carraigog.com',
      'phoneNumber': '086 1550344',
      'isAdministrator': true,
    }

    service.updateCoach(coach)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/updateCoach');

    expect(mockRequest.request.body).toEqual({
      coachDetails: {
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        }
    });

    mockRequest.flush(null);
  });

  it('should call url for delete coach', () => {
    service.deleteCoach(null, false)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deleteCoach');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for delete coach', () => {
    let coach: ICoach = {
      '_id': 'b093d6d273adfb49ae33e6e1',
      'firstName': 'Administrator',
      'surname': '',
      'emailAddress': 'admin@carraigog.com',
      'phoneNumber': '086 1550344',
      'isAdministrator': true,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'admin@carraigog.com',
      '__v': 0,
      'active': false,
      'currentSessionOwner': true
    }

    service.deleteCoach(coach, true)
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/deleteCoach');

    expect(mockRequest.request.body).toEqual({
      coachDetails: {
        '_id': 'b093d6d273adfb49ae33e6e1',
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'admin@carraigog.com',
        '__v': 0,
        'active': false,
        'currentSessionOwner': true
        },
      sendGoodbyeEmail: true
    });

    mockRequest.flush(null);
  });

  //TODO: Need to figure out how to inject a mock Angular5Csv to as to unit test downloadCSV.
});