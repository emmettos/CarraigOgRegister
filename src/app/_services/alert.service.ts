import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Subject } from 'rxjs';


@Injectable()
export class AlertService {
  private keepAfterNavigationChange: boolean = false;
  private alertStream: Subject<any> = new Subject<any>();

  constructor(private router: Router) {
    router.events
      .subscribe(
        event => {
          if (event instanceof NavigationStart) {
            if (this.keepAfterNavigationChange) {
              this.keepAfterNavigationChange = false;
            }
            else {
              this.alertStream.next();
            }
          }
        });
  }

  get getAlertStream(): Subject<any> {
    return this.alertStream;
  }

  error(header: string, message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alertStream.next({ type: 'error', title: header, text: message });
  }

  success(header: string, message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.alertStream.next({ type: 'success', title: header, text: message });
  }
}
