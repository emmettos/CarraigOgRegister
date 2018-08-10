import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthorizationService } from '../../_services';
import { IGroup } from '../../_models';

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
    
    component['group'] = {
      name: 'Test Player',
      yearOfBirth: 2018,
      footballManager: 'Football Manager',
      hurlingManager: 'Hurling Manager',
      numberOfPlayers: 51,
      lastUpdatedDate: '2018-02-27T15:57:21.582Z'    
    } as IGroup;

    authorizationService = TestBed.get(AuthorizationService);    
  });

  it('should create', () => {
    spyOnProperty(authorizationService, 'getPayload', 'get')
      .and.returnValue({
        userProfile: {
          isAdministrator: true
        }
      });
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
