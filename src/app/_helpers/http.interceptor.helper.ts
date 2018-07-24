import { Injectable, Injector } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor, 
  HttpResponse, 
  HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
  
import { ToasterService } from 'angular2-toaster';
  
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AlertService, AuthorizationService } from '../_services/index';


@Injectable()
export class HttpInterceptorHelper implements HttpInterceptor {
  constructor(
    private authorizationService: AuthorizationService,
    private injector: Injector,
    private toasterService: ToasterService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers: any = {},
        jwtToken: string;

    headers['X-Requested-With'] = 'XMLHttpRequest';

    if (request.method === 'GET') {
      headers['If-Modified-Since'] = '0';
    }

    if (jwtToken = this.authorizationService.readToken()) {
      headers['Authorization'] = 'Bearer ' + jwtToken;      
    }

    const modifiedRequest: HttpRequest<any> = request.clone({
      setHeaders: headers
    });

    return next.handle(modifiedRequest).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            let authorizationHeader = event.headers.get('Authorization');

            if (authorizationHeader) {
              this.authorizationService.parseToken(authorizationHeader.replace('Bearer ', ''), true);
            }
          }
        },
        error: (error: any) => {
          if (error instanceof HttpErrorResponse) {
            // These conditions should never occur because they will be caught in the route gaurds.
            // Leaving them here though just in case (IE. someone could try hack the JSON Web Token).
            if (error.status === 401) {
              if (error.url.indexOf('api/authenticate') === -1 && error.url.indexOf('api/writeLog') === -1) {
                // Unable to inject Router so explicitly getting it here.
                let router: Router = this.injector.get(Router);

                if (this.authorizationService.getPayload) {
                  if(!this.authorizationService.getActivePayload) {
                    this.authorizationService.deleteToken();
                    
                    this.toasterService.pop('warning', 'Your session has expired', 'Please login');

                    router.navigate(['/login']);
                  }
                  else {
                    this.toasterService.pop('warning', 'Unauthorized Access', 'Permission denied');

                    router.navigate(['/groups']);    
                  }
                }
                else {
                  this.toasterService.pop('warning', 'Unauthorized Access', 'Please login');

                  router.navigate(['/login']);
                }
              }
            }
            else {
              let alertService: AlertService = this.injector.get(AlertService);

              alertService.error(error.message, error.error.error ? error.error.error.message: "");
            }
          }
        }}));
  }
}
