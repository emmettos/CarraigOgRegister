import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from '../index';


describe('UserService', () => {
  let httpMock: HttpTestingController;

  let service: UserService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(UserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for login', () => {
    service.login('test@gmail.com', 'Password01')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/authenticate');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for login', () => {
    service.login('test@gmail.com', 'Password01')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/authenticate');

    expect(mockRequest.request.body).toEqual({
      emailAddress: 'test@gmail.com',
      password: 'Password01'
    });

    mockRequest.flush(null);
  });

  it('should call url for change password', () => {
    service.changePassword('test@gmail.com', 'Password01', 'Password02')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/changePassword');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for change password', () => {
    service.changePassword('test@gmail.com', 'Password01', 'Password02')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/changePassword');

    expect(mockRequest.request.body).toEqual({
      emailAddress: 'test@gmail.com',
      password: 'Password01',
      newPassword: 'Password02'
    });

    mockRequest.flush(null);
  });
});