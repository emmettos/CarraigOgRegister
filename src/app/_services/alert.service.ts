import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AlertService {
  private keepAfterNavigationChange: boolean = false;
  private alert: Subject<any> = new Subject<any>();

  constructor(private router: Router) {
    router.events
      .subscribe(
        event => {
          if (event instanceof NavigationStart) {
            if (this.keepAfterNavigationChange) {
              this.keepAfterNavigationChange = false;
            }
            else {
              this.alert.next();
            }
          }
        });
  }

  get getAlert(): Subject<any> {
    return this.alert;
  }

  error(header: string, message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alert.next({ type: 'error', title: header, text: message });
  }

  success(header: string, message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alert.next({ type: 'success', title: header, text: message });
  }
}
