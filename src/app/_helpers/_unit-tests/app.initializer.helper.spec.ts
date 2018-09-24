import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigurationService } from '../../_services/index';
import { readConfigurationSettings } from '../index';


describe('AppInitializerHelper', () => {
  let configurationService: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ConfigurationService
      ]
    });

    configurationService = TestBed.get(ConfigurationService);
  });

  it('should call ConfigurationService readConfigurationSettings', () => {
    spyOn(configurationService, 'readConfigurationSettings');

    readConfigurationSettings(configurationService)();

    expect(configurationService.readConfigurationSettings).toHaveBeenCalled();
  });
});
