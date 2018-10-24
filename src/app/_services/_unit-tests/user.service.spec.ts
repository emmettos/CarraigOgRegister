import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from '../index';


describe('UserService', () => {
  let httpMock: HttpTestingController;

  let usersService: UsersService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UsersService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    usersService = TestBed.get(UsersService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for authenticate', () => {
    usersService.login('test@gmail.com', 'Password01')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/authenticate');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for authenticate', () => {
    usersService.login('test@gmail.com', 'Password01')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/authenticate');

    expect(mockRequest.request.body).toEqual({
      emailAddress: 'test@gmail.com',
      password: 'Password01'
    });

    mockRequest.flush(null);
  });

  it('should call url for change password', () => {
    usersService.changePassword('test@gmail.com', 'Password01', 'Password02')
      .subscribe();

    const mockRequest = httpMock.expectOne('/api/changePassword');

    expect(mockRequest.request.method).toEqual("POST");

    mockRequest.flush(null);
  });

  it('should pass request body for change password', () => {
    usersService.changePassword('test@gmail.com', 'Password01', 'Password02')
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