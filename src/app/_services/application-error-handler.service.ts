import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import * as StackTrace from 'stacktrace-js';


@Injectable()
export class ApplicationErrorHandlerService implements ErrorHandler {
  private errorMessage: string;
  private stackString: Observable<any>

  constructor(private injector: Injector) { 
  }    

  get getErrorMessage(): string {
    return this.errorMessage;
  }

  get getStackString(): Observable<any> {
    return this.stackString;
  }

  handleError(error: any) {
    let router = this.injector.get(Router);
    
    console.error('An error occurred at [' + router.url + ']:', error);

    this.errorMessage = error.message;

    this.stackString = Observable.create(observer => {
      StackTrace.fromError(error)
        .then(stackframes => {
          let stackString: string = stackframes
            .splice(0, 20)
            .map(stackFrame => {
              return stackFrame.toString();
            })
            .join('\n');
          
          observer.next(stackString);
          observer.complete();

          let logMessage = {};
  
          logMessage['errorMessage'] = this.errorMessage, 
          logMessage['url'] = router.url,
          logMessage['stackTrace'] = stackString
  
          let http = this.injector.get(HttpClient);

          http.post('/api/writeLog', logMessage)
            .subscribe({
              error: error => {
                console.error('An error occurred calling api/writeLog:', error);
              }
            });
        });
    });

    router.navigate(['/error']);
  }
}