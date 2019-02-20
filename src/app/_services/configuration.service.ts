import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Referencing _helpers/index.ts is resulting in a Circular Dependency warning.
import { APP_SETTINGS } from '../_helpers/app.initializer.helper';


@Injectable()
export class ConfigurationService {
  constructor(private http: HttpClient) {
  }

  readConfigurationSettings(): Promise<any> {
    const promise = this.http.get<any>('/api/currentSettings')
      .toPromise()
      .then(response => {
        APP_SETTINGS.currentYear = response.body.currentSettings.year;

        for (let index = APP_SETTINGS.currentYear - 5; index > APP_SETTINGS.currentYear - 20; index--) {
          APP_SETTINGS.yearsOfBirth.push(index);
        }
      });

    return promise;
  }
}
