import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { AlertService, AuthorizationService } from '../../_services/index';
import { HttpInterceptorHelper } from '../index';
import { Alert } from 'selenium-webdriver';


@Component({
  template: 'Mock'
})
class MockComponent {
}

describe('HttpInterceptorHelper', () => {
  let http : HttpClient,
      httpMock: HttpTestingController;

  let location: Location;

  let alertService: AlertService,
      authorizationService: AuthorizationService,
      toasterService: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockComponent },
          { path: 'groups', component: MockComponent }
        ]),
        ToasterModule.forRoot()
      ],
      providers: [
        AlertService,
        AuthorizationService,
        ToasterService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorHelper,
          multi: true
        }
      ]
    });

    location = TestBed.get(Location);

    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);

    alertService = TestBed.get(AlertService);
    authorizationService = TestBed.get(AuthorizationService);
    toasterService = TestBed.get(ToasterService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add X-Requested-With header', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.get<any>('/dummy').subscribe();

    const mockRequest = httpMock.expectOne('/dummy');
  
    expect(mockRequest.request.headers.get('X-Requested-With')).toEqual('XMLHttpRequest');

    mockRequest.flush(null);
  });

  it('should add If-Modified-Since header to GET requests', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.get<any>('/dummy').subscribe();

    const mockRequest = httpMock.expectOne('/dummy');
  
    expect(mockRequest.request.headers.get('If-Modified-Since')).toEqual('0');

    mockRequest.flush(null);
  });

  it('should not add If-Modified-Since header to POST requests', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {}).subscribe();

    const mockRequest = httpMock.expectOne('/dummy');
  
    expect(mockRequest.request.headers.get('If-Modified-Since')).toBeNull();

    mockRequest.flush(null);
  });

  it('should add Authorization header to request', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue('Sample Token');

    http.post<any>('/dummy', {}).subscribe();

    const mockRequest = httpMock.expectOne('/dummy');
  
    expect(mockRequest.request.headers.get('Authorization')).toEqual('Bearer Sample Token')

    mockRequest.flush(null);
  });

  it('should read Authorization header from response', () => {
    let headers: any = {};

    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {}).subscribe();

    const mockRequest = httpMock.expectOne('/dummy');
  
    headers['Authorization'] = 'Bearer DummyJwtToken';

    spyOn(authorizationService, 'parseToken');

    mockRequest.flush({}, { headers: headers });

    expect(authorizationService.parseToken).toHaveBeenCalledWith('DummyJwtToken', true);
  });

  it('should ignore /api/authenticate 401 response', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/api/authenticate', {})
      .subscribe({
        error: error => {
        }
      });

    const mockRequest = httpMock.expectOne('/api/authenticate');
  
    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'Invalid password'
      }}, { status: 401, statusText: '' });

    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue(null);
    
    spyOn(toasterService, 'pop');

    expect(toasterService.pop).not.toHaveBeenCalled();
  });

  it('should ignore /api/writeLog 401 response', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/api/writeLog', {})
      .subscribe({
        error: error => {
        }
      });

    const mockRequest = httpMock.expectOne('/api/writeLog');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue(null);
    
    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'Invalid password'
      }}, { status: 401, statusText: '' });

    expect(toasterService.pop).not.toHaveBeenCalled();
  });

  it('should display Your Session has Expired for 401 response with expired payload', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload')
      .and.returnValue(null);
    spyOn(authorizationService, 'deleteToken');

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Your session has Expired', 'Please login');
  });

  it('should route to /login for 401 response with expired payload', fakeAsync(() => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload')
      .and.returnValue(null);
    spyOn(authorizationService, 'deleteToken');

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

      tick();

      expect(location.path()).toBe('/login');
  }));

  it('should display Unauthorized Access - Permission Denied for 401 response with up-to-date payload', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Unauthorized Access', 'Permission denied');
  });

  it('should route to /groups for 401 response with up-to-date payload', fakeAsync(() => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

      tick();

      expect(location.path()).toBe('/groups');
  }));

  it('should display Unauthorized Access - Please Login for 401 response with no payload', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue(null);

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Unauthorized Access', 'Please login');
  });

  it('should route to /login for 401 response with no payload', fakeAsync(() => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue(null);

    spyOn(toasterService, 'pop');

    mockRequest.flush({
      'error': {
        'statusCode': 401,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'User not authenticated'
      }}, { status: 401, statusText: '' });

      tick();

      expect(location.path()).toBe('/login');
  }));

  it('should display alert for non 401 response', () => {
    spyOn(authorizationService, 'readToken')
      .and.returnValue(null);

    http.post<any>('/dummy', {})
      .subscribe({
        error: error => {
        }
      });
  
    const mockRequest = httpMock.expectOne('/dummy');
  
    spyOnProperty(authorizationService, 'getPayload')
      .and.returnValue(null);

    spyOn(alertService, 'error');

    mockRequest.flush({
      'error': {
        'statusCode': 500,
        'requestID': '6842d498-b226-45be-9a46-f446c7743d2f',
        'message': 'An exception has occurred'
      }}, { status: 500, statusText: 'Internal Server Error' });

    expect(alertService.error).toHaveBeenCalledWith('Http failure response for /dummy: 500 Internal Server Error', 'An exception has occurred');
  });
});
