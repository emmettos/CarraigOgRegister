import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlSegment } from '@angular/router';
import { TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../../_services/index';
import { LoginGuard } from '../index';


@Component({
  template: 'Mock'
})
class MockComponent {
}

describe('LoginGuard', () => {
  let mockRouterStateSnapshot: RouterStateSnapshot;

  let location: Location;

  let loginGuard: LoginGuard,
      authorizationService: AuthorizationService,
      toasterService: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'groups', component: MockComponent }
        ]),
        ToasterModule.forRoot()
      ],
      providers: [
        LoginGuard,
        AuthorizationService,
        ToasterService
      ]
    });

    mockRouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);

    location = TestBed.get(Location);

    loginGuard = TestBed.get(LoginGuard);
    authorizationService = TestBed.get(AuthorizationService);
    toasterService = TestBed.get(ToasterService);

    spyOn(toasterService, 'pop');
  });

  it('should not allow for active payload', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    expect(loginGuard.canActivate(null, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should display Active Session Found for active payload', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    loginGuard.canActivate(null, mockRouterStateSnapshot);

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Active Session Found', 'Redirecting to Home');
  });

  it('should route to /login for expired payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    loginGuard.canActivate(null, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/groups');
  }));

  it('should allow for no active payload', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    expect(loginGuard.canActivate(null, mockRouterStateSnapshot)).toBeTruthy();
  });
});
