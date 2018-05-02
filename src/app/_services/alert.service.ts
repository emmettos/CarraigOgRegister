import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AlertService {
  private keepAfterNavigationChange = false;
  private subject = new Subject<any>();

  constructor(private router: Router) {
    router.events
      .subscribe(
        event => {
          if (event instanceof NavigationStart) {
            if (this.keepAfterNavigationChange) {
              this.keepAfterNavigationChange = false;
            }
            else {
              this.subject.next();
            }
          }
        });
  }

  error(message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterNavigationChange: boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }
}
