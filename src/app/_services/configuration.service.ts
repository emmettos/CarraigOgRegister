import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

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
        APP_SETTINGS.groupYears = response.body.currentSettings.groupYears;
      });

    return promise;
  }
}
