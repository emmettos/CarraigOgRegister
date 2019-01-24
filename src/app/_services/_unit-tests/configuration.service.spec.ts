import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { APP_SETTINGS } from '../../_helpers/app.initializer.helper';
import { ConfigurationService } from '../index';


describe('ConfigurationService', () => {
  let httpMock: HttpTestingController;

  let service: ConfigurationService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ConfigurationService
      ]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(ConfigurationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call url for read configuration settings', () => {
    service.readConfigurationSettings();

    const mockRequest = httpMock.expectOne('/api/currentSettings');

    expect(mockRequest.request.method).toEqual("GET");

    mockRequest.flush({
      body: {
        currentSettings: {
          year: 2018
        }
      }
    });
  });

  it('should return promise for read configuration settings', () => {
    expect(service.readConfigurationSettings()).toEqual(jasmine.any(Promise));

    const mockRequest = httpMock.expectOne('/api/currentSettings');

    mockRequest.flush({
      body: {
        currentSettings: {
          year: 2018
        }
      }
    });
  });

  it('should initialize APP_SETTINGS from read configuration settings', fakeAsync(() => {
    service.readConfigurationSettings();

    const mockRequest = httpMock.expectOne('/api/currentSettings');

    APP_SETTINGS.currentYear = 0;

    mockRequest.flush({
      body: {
        currentSettings: {
          year: 2018
        }
      }
    });

    tick();

    expect(APP_SETTINGS).toEqual({
      currentYear: 2018
    });
  }));
});