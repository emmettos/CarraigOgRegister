import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule } from 'angular2-toaster';

import { AuthorizationService } from '../../_services/index';

import { NavComponent } from './nav.component';


class MockHttpClient {
  get() {}
  post() {}
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  let authorizationService: AuthorizationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NavComponent 
      ],
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot()    
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        AuthorizationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    
    authorizationService = TestBed.get(AuthorizationService);

    spyOn(authorizationService, 'getActivePayload')
      .and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
