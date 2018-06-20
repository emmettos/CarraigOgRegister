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
  
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';

import { AuthorizationService } from '../_services/index';

import { IPayload } from '../_models/index';


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

    return next.handle(modifiedRequest).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let authorizationHeader = event.headers.get('Authorization');

          if (authorizationHeader) {
            this.authorizationService.parseToken(authorizationHeader.replace('Bearer ', ''), true);
          }
          // else {
          //   this.authorizationService.deleteToken();
          // }
        }
      },
      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 && error.url.indexOf('api/authenticate') === -1) {
            // Unable to inject Router so explicitly getting it here.
            let router: Router = this.injector.get(Router),
                toasterTitle: string = '[I] Unauthorized Access';

            if (this.authorizationService.getPayload) {
              this.authorizationService.deleteToken();
              
              toasterTitle = '[I] Your session has expired';
            }
              
            this.toasterService.pop('warning', toasterTitle, 'Please login');

            router.navigate(['/login']);
          }
        }
      }
    );
  }
}
