import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { CoachesService } from '../../_services';
import { ValidationService } from '../../_modules/shared/_services';

import { LoginComponent } from './login.component';


@Component({
  template: 'Mock'
})
class MockComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let location: Location;
  let coachesService: CoachesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent, 
        LoginComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: "groups", component: MockComponent }
        ])
      ],
      providers: [
        CoachesService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    location = TestBed.get(Location);
    
    coachesService = TestBed.get(CoachesService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authentication failed message to be hidden', () => {
    expect(fixture.nativeElement.querySelector('#authentication-failed-message')).toBeNull();  
  });

  it('should initialize password changed message to be hidden', () => {
    expect(fixture.nativeElement.querySelector('#password-changed-message')).toBeNull();  
  });

  it('should initialize change password mode', () => {
    expect(component.loginForm.controls['changePasswordMode'].value).toBeFalsy();
  });

  it('should initialize email address field', () => {
    expect(component.loginForm.controls['emailAddress'].value).toEqual('');
  });

  it('should initialize password field', () => {
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['password'].value).toEqual('');
  });

  it('should initialize change password div to be hidden', () => {
    expect(fixture.nativeElement.querySelector('#change-password').hidden).toBeTruthy();  
  });

  it('should initialize new password field', () => {
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].enabled).toBeFalsy()
  });

  it('should initialize confirm password field', () => {
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].enabled).toBeFalsy()
  });

  it('should initialize submit button', () => {
    expect(fixture.nativeElement.querySelector('button[type=submit]').innerHTML).toEqual(' Sign In ');  
  });

  it('should update form value in login mode', () => {
    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'password01' });

    expect(component.loginForm.value).toEqual({
      changePasswordMode: false,
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: 'password01'
      }
    });
  });

  it('should update form value in change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].setValue({
      password: 'password01',
      newPassword: 'password02',
      confirmPassword: 'password02'
    });

    expect(component.loginForm.value).toEqual({
      changePasswordMode: true,
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: 'password01',
        newPassword: 'password02',
        confirmPassword: 'password02'
      }
    });
  });

  it('should validate blank email', () => {
    component.loginForm.controls['emailAddress'].setValue('');
    expect(component.loginForm.controls['emailAddress'].invalid).toBeTruthy();
  });

  it('should validate invalid email', () => {
    component.loginForm.controls['emailAddress'].setValue('badaddress');
    expect(component.loginForm.controls['emailAddress'].invalid).toBeTruthy();
  });

  it('should validate valid email', () => {
    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    expect(component.loginForm.controls['emailAddress'].invalid).toBeFalsy();
  });

  it('should validate blank password', () => {
    component.loginForm.controls['passwordGroup'].patchValue({ password: '' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['password'].invalid).toBeTruthy();
  });

  it('should validate invalid password', () => {
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'tiny' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['password'].invalid).toBeTruthy();
  });

  it('should validate valid password', () => {
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'password01' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['password'].invalid).toBeFalsy();
  });

  it('should validate blank new password', () => {
    component.newPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ newPassword: '' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid short new password', () => {
    component.newPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ newPassword: 'tiny' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid long new password', () => {
    component.newPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ newPassword: 'longPassword01' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].invalid).toBeTruthy();
  });

  it('should validate valid new password', () => {
    component.newPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ newPassword: 'password01' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].invalid).toBeFalsy();
  });

  it('should validate blank confirm password', () => {
    component.confirmPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ confirmPassword: '' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid short confirm password', () => {
    component.newPasswordControl.enable();
    component.confirmPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ 
      newPassword: 'tiny',
      confirmPassword: 'tiny' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate invalid long confirm password', () => {
    component.newPasswordControl.enable();
    component.confirmPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ 
      newPassword: 'longPassword01',
      confirmPassword: 'longPassword01' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should validate valid confirm password', () => {
    component.newPasswordControl.enable();
    component.confirmPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ 
      newPassword: 'password01',
      confirmPassword: 'password01' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].invalid).toBeFalsy();
  });

  it('should validate valid mismatching confirm password', () => {
    component.newPasswordControl.enable();
    component.confirmPasswordControl.enable();

    component.loginForm.controls['passwordGroup'].patchValue({ 
      newPassword: 'password01',
      confirmPassword: 'password01xxx' });
    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].invalid).toBeTruthy();
  });

  it('should blank form password fields after switch to change password mode', () => {
    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].patchValue({
      password: 'password'
    });

    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect(component.loginForm.value).toEqual({
      changePasswordMode: true,
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    });
  });

  it('should blank form password fields after switch from change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();

    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].setValue({
      password: 'password',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword'
    });

    component.loginForm.controls['changePasswordMode'].setValue(false);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect(component.loginForm.value).toEqual({
      changePasswordMode: false,
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: ''
      }
    });
  });

  it('should enable new password after switch to change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].enabled).toBeTruthy();
  });

  it('should enable confirm password after switch to change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].enabled).toBeTruthy();
  });

  it('should disable new password after switch from change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    component.loginForm.controls['changePasswordMode'].setValue(false);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['newPassword'].enabled).toBeFalsy();
  });

  it('should disable confirm password after switch from change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    component.loginForm.controls['changePasswordMode'].setValue(false);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();

    expect((component.loginForm.controls['passwordGroup'] as FormGroup).controls['confirmPassword'].enabled).toBeFalsy();
  });

  it('should disable submit button for invalid form', () => {
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'tiny' });
    
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'password' });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBeFalsy()  
  });

  it('should display [Change Password] for submit button in change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[type=submit]').innerHTML).toEqual(' Change Password ');  
  });

  it('should show change-password div in change password mode', () => {
    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#change-password').hidden).toBeFalsy();  
  });

  it('should route to /groups after successful login', fakeAsync(() => {
    spyOn(coachesService, 'login')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }));

      component.loginForm.controls['emailAddress'].setValue('user@test.com');
      component.loginForm.controls['passwordGroup'].patchValue({ password: 'password01' });
  
      fixture.detectChanges();
  
      component.onSubmit({
        emailAddress: 'user@test.com',
        passwordGroup: {
          password: 'password01'
        }
      });

      tick();

      expect(location.path()).toBe('/groups');
  }));

  it('should display authentication failed message after failed login', () => {
    spyOn(coachesService, 'login')
      .and.returnValue(throwError({
        status: 401,
        error: {
          error: {
            message: 'Failed authentication message'
          }
        }
      }));

    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].patchValue({ password: 'password01' });

    fixture.detectChanges();

    component.onSubmit({
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: 'password01'
      }
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#authentication-failed-message').children[0].innerHTML).toEqual('Failed authentication message');  
  });

  it('should display password changed message after successful changed password', () => {
    spyOn(coachesService, 'changePassword')
      .and.returnValue(of({
        "error": null,
        "body": {}
      }));

      component.loginForm.controls['changePasswordMode'].setValue(true);

      fixture.detectChanges();
      component.onChangeChangePasswordMode();
    
      component.loginForm.controls['emailAddress'].setValue('user@test.com');
      component.loginForm.controls['passwordGroup'].setValue({ 
        password: 'password01',
        newPassword: 'password02',
        confirmPassword: 'password02'
      });
  
      fixture.detectChanges();
  
      component.onSubmit({
        changePasswordMode: true,
        emailAddress: 'user@test.com',
        passwordGroup: {
          password: 'password01',
          newPassword: 'password02',
          confirmPassword: 'password02'
        }
      });
  
      fixture.detectChanges();
  
      expect(fixture.nativeElement.querySelector('#password-changed-message').children[0].innerHTML).toEqual('Password Successfully Changed');        
  });
  
  it('should display authentication failed message after failed change password', () => {
    spyOn(coachesService, 'changePassword')
      .and.returnValue(throwError({
        status: 401,
        error: {
          error: {
            message: 'Failed authentication message'
          }
        }
      }));

    component.loginForm.controls['changePasswordMode'].setValue(true);

    fixture.detectChanges();
    component.onChangeChangePasswordMode();
  
    component.loginForm.controls['emailAddress'].setValue('user@test.com');
    component.loginForm.controls['passwordGroup'].setValue({ 
      password: 'password01',
      newPassword: 'password02',
      confirmPassword: 'password02'
    });

    fixture.detectChanges();

    component.onSubmit({
      changePasswordMode: true,
      emailAddress: 'user@test.com',
      passwordGroup: {
        password: 'password01',
        newPassword: 'password02',
        confirmPassword: 'password02'
      }
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#authentication-failed-message').children[0].innerHTML).toEqual('Failed authentication message');  
  });
});
