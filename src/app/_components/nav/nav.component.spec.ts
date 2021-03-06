import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../../_services/index';

import { NavComponent } from './nav.component';


@Component({
  template: 'Mock'
})
class MockComponent {
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  let location: Location;
  let authorizationService: AuthorizationService;
  let toasterService: ToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockComponent,
        NavComponent 
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: "login", component: MockComponent }
        ]),
        NgbModule.forRoot(),
        ToasterModule.forRoot()    
      ],
      providers: [
        AuthorizationService,
        ToasterService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    
    location = TestBed.get(Location);

    authorizationService = TestBed.get(AuthorizationService);
    toasterService = TestBed.get(ToasterService);

    spyOn(console, 'error');
    
    spyOn(toasterService, 'pop');
  });

  it('should create', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();
  
    expect(component).toBeTruthy();
  });

  it('should home link as /login for signed out user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#home-link").attributes['href'].nodeValue).toEqual('/login');
  });

  it('should display home link as /groups for signed in user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#home-link").attributes['href'].nodeValue).toEqual('/groups');
  });

  it('should hide Signed in as... menu for signed out user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#signed-in-menu")).toBeNull();
  });

  it('should hide Sign Out menu for signed out user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#sign-out-menu")).toBeNull();
  });

  it('should hide Administration menu for signed out user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administration-menu").style.getPropertyValue('display')).toEqual('none');
  });

  it('should display Signed in as... menu for signed in user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#signed-in-menu").innerHTML).toEqual('Signed in as - Test Coach');
  });

  it('should display Sign Out menu for signed in user', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#sign-out-menu")).toBeTruthy();
  });

  it('should hide Administration menu for non-administrators', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administration-menu").style.getPropertyValue('display')).toEqual('none');
  });

  it('should display Admin menu for administrators', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: true
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administration-menu").style.getPropertyValue('display')).toEqual('inline');
  });

  it('should include Players sub menu', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: true
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administration-dropdown a:nth-child(1)").innerHTML).toEqual('Players');
  });

  it('should include Coaches sub menu', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: true
        }
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administration-dropdown a:nth-child(2)").innerHTML).toEqual('Coaches');
  });

  it('should display Successfully Signed Out when signing out of active session', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    fixture.detectChanges();

    component.onClickLogout();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Successfully Signed Out', 'Goodbye');
  });

  it('should display Your session had expired when signing out of inactive session', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue(null);

    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue(null);

    fixture.detectChanges();

    component.onClickLogout();

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'Your session had Expired', 'Goodbye');
  });

  it('should call authorizationService.deleteToken when signing out', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    spyOn(authorizationService, 'deleteToken');

    fixture.detectChanges();

    component.onClickLogout();

    expect(authorizationService.deleteToken).toHaveBeenCalled();
  });

  it('should route to /login after signing out', fakeAsync(() => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'xxx',
          fullName: 'Test Coach',
          isAdministrator: false
        }
      });

    spyOn(authorizationService, 'deleteToken');

    fixture.detectChanges();

    component.onClickLogout();

    tick();

    expect(location.path()).toBe('/login');
  }));
});
