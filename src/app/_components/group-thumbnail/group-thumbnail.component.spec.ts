import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthorizationService } from '../../_services';
import { IGroupSummary } from '../../_models';

import { GroupThumbnailComponent } from './group-thumbnail.component';


describe('GroupThumbnailComponent', () => {
  let component: GroupThumbnailComponent;
  let fixture: ComponentFixture<GroupThumbnailComponent>;
  let authorizationService: AuthorizationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        GroupThumbnailComponent 
      ],
      providers: [
        AuthorizationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupThumbnailComponent);
    component = fixture.componentInstance;

    component['groupSummary'] = {
      'name': 'Test Group',
      'yearOfBirth': 2009,
      'footballCoachFullName': 'Pat Football',
      'hurlingCoachFullName': 'John Hurling',
      'numberOfPlayers': 51,
      'lastUpdatedDate': '2018-02-27T15:57:21.582Z'    
    } as IGroupSummary;

    authorizationService = TestBed.get(AuthorizationService);    
  });

  it('should create', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display group name', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-header").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Test Group</strong> \\(Year of Birth: 2009\\)$');
  });

  it('should display football coach', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#football-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Football Coach:</strong> Pat Football$');
  });

  it('should display hurling coach', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#hurling-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Hurling Coach:</strong> John Hurling$');
  });

  it('should display number of players', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#number-of-players").innerHTML).toEqual('No. players currently registered: 51');
  });

  it('should display last updated date', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-footer").innerHTML).toEqual(' Last Updated: 27/02/18 3:57 PM ');
  });

  it('should create group details link', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-details-link").href).toMatch('http://localhost:\\d+/players/Test%20Group/2009');
  });

  it('should enable group link for an administrator', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-details-link").style.getPropertyValue('disabled')).toBeFalsy();
  });

  it('should enable group link for a group coach', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: false,
          isManager: true,
          groups: [2009]
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-details-link").style.getPropertyValue('disabled')).toBeFalsy();
  });

  it('should disable group link for other coach', () => {
    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: false,
          isManager: true,
          groups: [2010]
        }
      });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-details-link").style.getPropertyValue('disabled')).toEqual('');
  });
});
