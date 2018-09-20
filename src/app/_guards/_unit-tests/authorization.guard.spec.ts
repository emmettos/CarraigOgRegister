import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlSegment } from '@angular/router';
import { TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../../_services/index';
import { AuthorizationGuard } from '../index';


@Component({
  template: 'Mock'
})
class MockComponent {
}

describe('AuthorizationGuard', () => {
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot,
      mockRouterStateSnapshot: RouterStateSnapshot;

  let location: Location;

  let authorizationGuard: AuthorizationGuard,
      authorizationService: AuthorizationService,
      toasterService: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: MockComponent },
          { path: 'groups', component: MockComponent }
        ]),
        ToasterModule.forRoot()
      ],
      providers: [
        AuthorizationGuard,
        AuthorizationService,
        ToasterService
      ]
    });

    mockActivatedRouteSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>("ActivatedRouteSnapshot", ['toString']);
    mockRouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>("RouterStateSnapshot", ['toString']);

    location = TestBed.get(Location);

    authorizationGuard = TestBed.get(AuthorizationGuard);
    authorizationService = TestBed.get(AuthorizationService);
    toasterService = TestBed.get(ToasterService);

    spyOn(authorizationService, 'deleteToken');
    spyOn(toasterService, 'pop');
  });

  it('should not allow when no payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should display Unauthorized Access when no payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Unauthorized Access', 'Please login');
  });

  it('should route to /login for no payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/login');
  }));

  it('should set return query parameter for no payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    mockRouterStateSnapshot.url = 'admin/manage-players';

    let router: Router = TestBed.get(Router);

    spyOn(router, 'navigate');

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams : { return: 'admin/manage-players' } });
  });

  it('should not allow for expired payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should display Your Session has Expired for expired payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Your Session has Expired', 'Please login');
  });

  it('should route to /login for expired payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/login');
  }));

  it('should set return query parameter for expired payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    mockRouterStateSnapshot.url = '/administration/manage-players';

    let router: Router = TestBed.get(Router);

    spyOn(router, 'navigate');

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams : { return: '/administration/manage-players' } });
  });

  it('should call authorizationService.deleteToken for expired payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    expect(authorizationService.deleteToken).toHaveBeenCalled();
  });

  it('should allow /groups for active payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    mockRouterStateSnapshot.url = '/groups';

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeTruthy();
  });

  it('should not allow /administration/manage-players for active non administrator payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    mockRouterStateSnapshot.url = '/administration/manage-players';

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should route to /groups on attempting /administration/manage-players for active non-administrator payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false
        }
      });

    mockRouterStateSnapshot.url = '/administration/manage-players';

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/groups');
  }));

  it('should allow /administration/manage-players for active administrator payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: true
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: true
        }
      });

    mockRouterStateSnapshot.url = '/administration/manage-players';

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeTruthy();
  });

  it('should not allow /players/:groupName/:yearOfBirth for active non-manager payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: false
        }
      });

    mockRouterStateSnapshot.url = '/players/Under 9/2009';

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should route to /groups on attempting /players/:groupName/:yearOfBirth for active non-manager payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: false
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: false
        }
      });

    mockRouterStateSnapshot.url = '/players/Under 9/2009';

    authorizationGuard.canActivate(null, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/groups');
  }));

  it('should not allow /players/:groupName/:yearOfBirth for active other manager payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });

    mockActivatedRouteSnapshot.url = [null, null, new UrlSegment('2009', null)];
    mockRouterStateSnapshot.url = '/players/Under 9/2009';

    expect(authorizationGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)).toBeFalsy();
  });

  it('should route to /groups on attempting /players/:groupName/:yearOfBirth for active other manager payload', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });

    mockActivatedRouteSnapshot.url = [null, null, new UrlSegment('2009', null)];
    mockRouterStateSnapshot.url = '/players/Under 9/2009';

    authorizationGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

    tick();

    expect(location.path()).toBe('/groups');
  }));

  it('should allow /players/:groupName/:yearOfBirth for active manager payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: false,
          isManager: true,
          groups: [2008]
        }
      });

    mockActivatedRouteSnapshot.url = [null, null, new UrlSegment('2008', null)];
    mockRouterStateSnapshot.url = '/players/Under 10/2008';

    expect(authorizationGuard.canActivate(mockActivatedRouteSnapshot, mockRouterStateSnapshot)).toBeTruthy();
  });

  it('should allow /players/:groupName/:yearOfBirth for active administrator payload', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: true,
        }
      });
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test User',
          isAdministrator: true,
        }
      });

    mockRouterStateSnapshot.url = '/players/Under 10/2008';

    expect(authorizationGuard.canActivate(null, mockRouterStateSnapshot)).toBeTruthy();
  });
});
