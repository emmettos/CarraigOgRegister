import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { UserService } from '../../_services';
import { ValidationService } from '../../_modules/shared/_services';

import { LoginComponent } from './login.component';


class MockHttpClient {
  get() {}
  post() {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LoginComponent 
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        UserService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    userService = TestBed.get(UserService);

    spyOn(userService, 'changePassword')
      .and.returnValue(of({}));
    spyOn(userService, 'login')
      .and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
