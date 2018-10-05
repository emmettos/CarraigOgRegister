import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpResponse, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { AuthorizationService } from '../_services/index';


@Injectable()
export class FakeBackendInterceptorHelper implements HttpInterceptor {
  private currentSettings: any;
  private users: any[];
  private groups: any[];

  constructor(private authorizationService: AuthorizationService) { 
    this.currentSettings = JSON.parse(localStorage.getItem('carraig-og-register.currentSettings')) || {
      year: 2018,
      groupYears: [2008, 2009, 2010, 2011, 2012, 2013]
    }

    this.users = JSON.parse(localStorage.getItem('carraig-og-register.users')) || [
      {
        emailAddress: 'administrator@carraigog.com',
        fullName: 'Administrator',
        isAdministrator: true,
        isManager: false,
        groups: [],
        password: 'Password01#'
      },
      {
        emailAddress: 'football2009@carraigog.com',
        fullName: 'Football 2009',
        isAdministrator: false,
        isManager: true,
        groups: [2009],
        password: 'Password01#'
      },
      {
        emailAddress: 'hurling2009@carraigog.com',
        fullName: 'Hurling 2009',
        isAdministrator: false,
        isManager: true,
        groups: [2009],
        password: 'Password01#'
      }
    ];

    this.groups = JSON.parse(localStorage.getItem('carraig-og-register.groups')) || [
      {
        'year': 2018,
        'name': 'Under 10',
        'yearOfBirth': 2008,
        'footballManager': 'Football 2008',
        'hurlingManager': 'Hurling 2008',
        'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
        'numberOfPlayers': 3
      },
      {
        'year': 2018,
        'name': 'Under 9',
        'yearOfBirth': 2009,
        'footballManager': 'Football 2009',
        'hurlingManager': 'Hurling 2009',
        'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
        'numberOfPlayers': 10
      },
      {
        'year': 2018,
        'name': 'Under 8',
        'yearOfBirth': 2010,
        'footballManager': 'Football 2010',
        'hurlingManager': 'Hurling 2010',
        'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
        'numberOfPlayers': 4
      },
      {
        'year': 2018,
        'name': 'Under 7',
        'yearOfBirth': 2011,
        'footballManager': 'Football 2011',
        'hurlingManager': 'Hurling 2011',
        'lastUpdatedDate': '2018-02-27T16:00:20.439Z',
        'numberOfPlayers': 5
      },
      {
        'year': 2018,
        'name': 'Under 6',
        'yearOfBirth': 2012,
        'footballManager': 'Football 2012',
        'hurlingManager': 'Hurling 2012',
        'lastUpdatedDate': '2018-02-27T12:20:39.338Z',
        'numberOfPlayers': 5
      },
      {
        'year': 2018,
        'name': 'Under 5',
        'yearOfBirth': 2013,
        'footballManager': 'Football 2013',
        'hurlingManager': 'Hurling 2013',
        'lastUpdatedDate': '2018-02-27T12:09:40.660Z',
        'numberOfPlayers': 16
      }
    ]
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {
      if (request.url.endsWith('/currentSettings')) {
        let body = {
          currentSettings: this.currentSettings
        };

        return of(new HttpResponse({ status: 200, body: { body: body }}));
      }

      if (request.url.endsWith('/authenticate')) {
        let user: any = this.users.filter(user => {
          return user.emailAddress === request.body.emailAddress;
        });

        if (!user.length) {
          return throwError({ 
            status: 401,
            error: {
              error: {
                message: 'User not found'
            }   }
          });
        }

        if (user[0].password !== request.body.password) {
          return throwError({ 
            status: 401,
            error: {
              error: {
                message: 'Invalid password'
            }   }
          });
        }

        let issuedTime: number = Math.floor(Date.now() / 1000);

        this.authorizationService.payload = {
          userProfile: {
            ID: user[0].emailAddress,
            fullName: user[0].fullName,
            isAdministrator: user[0].isAdministrator,
            isManager: user[0].isManager,
            groups: user[0].groups
          },
          iat: issuedTime,
          exp: issuedTime + (60 * 60)
        }

        return of(new HttpResponse({ status: 200, body: {} }));
      }

      if (request.url.endsWith('/changePassword')) {
        let user: any = this.users.filter(user => {
          return user.emailAddress === request.body.emailAddress;
        });

        if (!user.length) {
          return throwError({ 
            status: 401,
            error: {
              error: {
                message: 'User not found'
            }   }
          });
        }

        if (user[0].password !== request.body.password) {
          return throwError({ 
            status: 401,
            error: {
              error: {
                message: 'Invalid password'
            }   }
          });
        }

        user[0].password = request.body.newPassword;

        localStorage.setItem('carraig-og-register.users', JSON.stringify(this.users));

        return of(new HttpResponse({ status: 200, body: {} }));
      }

      if (request.url.endsWith('/groups')) {
        let body = {
          groups: this.groups
        };

        return of(new HttpResponse({ status: 200, body: { body: body }}));
      }

      return next.handle(request);      
    }))
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }
}
