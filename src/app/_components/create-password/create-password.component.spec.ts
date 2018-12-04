import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { UserService } from '../../_services';
import { ValidationService } from '../../_modules/shared/_services';

import { CreatePasswordComponent } from './create-password.component';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';


@Component({
  template: 'Mock'
})
class MockComponent {}

describe('CreatePasswordComponent', () => {
  let component: CreatePasswordComponent;
  let fixture: ComponentFixture<CreatePasswordComponent>;

  let location: Location;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent, 
        CreatePasswordComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: "login", component: MockComponent }
        ])
      ],
      providers: [
        { 
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                userToken: 'dummyToken'
              })
            }
          }
        },
        UserService,
        ValidationService
      ],
      schemas: [ 
        NO_ERRORS_SCHEMA 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePasswordComponent);
    component = fixture.componentInstance;

    location = TestBed.get(Location);
    
    userService = TestBed.get(UserService);
  });

  it('should create', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize please create a password to be visible', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#please-create-password')).not.toBeNull();  
  });

  it('should display email address', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#email-address').innerHTML).toEqual('test@gmail.com');
  });

  it('should initialize token failed message to be hidden', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#token-failed-message')).toBeNull();  
  });

  it('should initialize password created message to be hidden', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#password-created-message')).toBeNull();  
  });

  it('should initialize password field', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(component.createPasswordForm.controls['password'].value).toEqual('');
  });

  it('should initialize confirm password field', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    expect(component.createPasswordForm.controls['confirmPassword'].value).toEqual('');
  });

  it('should update form value', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Test001');
    component.createPasswordForm.controls['confirmPassword'].setValue('Test001');

    expect(component.createPasswordForm.value).toEqual({
      password: 'Test001',
      confirmPassword: 'Test001'
    });
  });

  it('should validate blank password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('');

    expect(component.createPasswordForm.controls['password'].invalid).toBeTruthy();
  });

  it('should validate invalid short password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('tiny');

    expect(component.createPasswordForm.controls['password'].invalid).toBeTruthy();
  });

  it('should validate invalid long password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('longPassword01');

    expect(component.createPasswordForm.controls['password'].invalid).toBeTruthy();
  });

  it('should validate valid password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');

    expect(component.createPasswordForm.controls['password'].invalid).toBeFalsy();
  });

  it('should validate blank confirm password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['confirmPassword'].setValue('');

    expect(component.createPasswordForm.controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid short confirm password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('tiny');
    component.createPasswordForm.controls['confirmPassword'].setValue('tiny');

    expect(component.createPasswordForm.controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid long confirm password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('LongPassword01');
    component.createPasswordForm.controls['confirmPassword'].setValue('LongPassword01');

    expect(component.createPasswordForm.controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate valid confirm password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    expect(component.createPasswordForm.controls['confirmPassword'].invalid).toBeFalsy();
  });

  it('should validate valid mismatching confirm password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01XXX');

    expect(component.createPasswordForm.controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should disable submit button for invalid form', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  });

  it('should display token failed message when verify user token fails', () => {
    spyOn(userService , 'verifyUserToken')
      .and.callFake(() => {
        return throwError({
          error: {
            error: {
              message: 'Error message'
            }
          },
          status: 401
        });
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#token-failed-message').innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Error message</strong>$');
  });

  it('should disable password control when verify user token fails', () => {
    spyOn(userService , 'verifyUserToken')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    fixture.detectChanges();

    expect(component.passwordControl.disabled).toBeTruthy();
  });

  it('should disable confirm password control when verify user token fails', () => {
    spyOn(userService , 'verifyUserToken')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    fixture.detectChanges();

    expect(component.confirmPasswordControl.disabled).toBeTruthy();
  });

  it('should disable submit button when verify user token fails', () => {
    spyOn(userService , 'verifyUserToken')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy(); 
  });

  it('should call userService.createPassword when creating a new password', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }));

    component.onSubmit(component.createPasswordForm.value);

    expect(userService.createPassword).toHaveBeenCalled();
  });

  it('should set creatingPassword to true after submitting a password to be created', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }, AsyncScheduler));

    component.onSubmit(component.createPasswordForm.value);

    expect(component.creatingPassword).toBeTruthy();
  });

  it('should disable password control after submitting a password to be created', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }, AsyncScheduler));

    component.onSubmit(component.createPasswordForm.value);

    expect(component.passwordControl.disabled).toBeTruthy();
  });

  it('should disable confirm password control after submitting a password to be created', () => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }));

    component.onSubmit(component.createPasswordForm.value);

    expect(component.confirmPasswordControl.disabled).toBeTruthy();
  });

  it('should set passwordCreated to true after successfully creating a password', fakeAsync(() => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }, AsyncScheduler));

    component.onSubmit(component.createPasswordForm.value);

    tick(5000);

    expect(component.passwordCreated).toBeTruthy();
  }));

  it('should redirect to /login after sucessfully creating a password', fakeAsync(() => {
    spyOn(userService, 'verifyUserToken')
      .and.returnValue(of({
        'error': null,
        'body': {
          'emailAddress': 'test@gmail.com'
        }
      }));

    fixture.detectChanges();

    component.createPasswordForm.controls['password'].setValue('Password01');
    component.createPasswordForm.controls['confirmPassword'].setValue('Password01');

    fixture.detectChanges();

    spyOn(userService, 'createPassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }, AsyncScheduler));

    component.onSubmit(component.createPasswordForm.value);

    tick(5000);

    expect(location.path()).toBe('/login');
  }));
});
