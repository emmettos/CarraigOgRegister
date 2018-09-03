import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../_services/index';
import { ValidationService } from '../../_modules/shared/_services/index';


@Component({
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  changePasswordModeControl: FormControl;
  emailAddressControl: FormControl;
  passwordControl: FormControl;
  newPasswordControl: FormControl;
  confirmPasswordControl: FormControl;

  errorMessage: string = null;
  authenticationFailed: boolean = false;
  passwordChanged: boolean = false;

  constructor(
    private validationService: ValidationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {   
  }

  ngOnInit() {
    this.changePasswordModeControl = new FormControl(false);
    this.emailAddressControl = new FormControl('', [Validators.required, this.validationService.emailValidator]);
    this.passwordControl = new FormControl('', [Validators.minLength(5), Validators.required]);
    this.newPasswordControl = new FormControl('', [Validators.minLength(5), Validators.required]);
    this.confirmPasswordControl = new FormControl('', [Validators.minLength(5), Validators.required, this.validationService.passwordMatchValidator(this.newPasswordControl)]);

    this.loginForm = new FormGroup({
      changePasswordMode: this.changePasswordModeControl,
      emailAddress: this.emailAddressControl,
      passwordGroup: new FormGroup({
        password: this.passwordControl,
        newPassword: this.newPasswordControl,
        confirmPassword: this.confirmPasswordControl  
      })
    });

    this.newPasswordControl.disable();
    this.confirmPasswordControl.disable();
  }

  onChangeChangePasswordMode() {
    this.authenticationFailed = false;
    this.passwordChanged = false;

    this.loginForm.controls['passwordGroup'].setValue({
      password: '',
      newPassword: '',
      confirmPassword: ''
    });
    this.loginForm.controls['passwordGroup'].markAsUntouched();

    if (this.changePasswordModeControl.value) {
      this.newPasswordControl.enable();
      this.confirmPasswordControl.enable();
    }
    else {
      this.newPasswordControl.disable();
      this.confirmPasswordControl.disable();
    }
  }

  onSubmit(formValues) {
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationFailed = false;
    this.passwordChanged = false;

    if (!formValues.changePasswordMode) {
      this.login(formValues.emailAddress, formValues.passwordGroup.password);
    }
    else {
      this.changePassword(formValues.emailAddress, formValues.passwordGroup.password, formValues.passwordGroup.newPassword);
    }
  }

  private changePassword(emailAddress: string, password: string, newPassword: string) {
    this.userService.changePassword(emailAddress, password, newPassword)
      .subscribe({
        next: response => {
          this.changePasswordModeControl.setValue(false);
        
          this.onChangeChangePasswordMode();

          this.passwordChanged = true;
        },
        error: error => {
          if (error.status === 401) {
            this.errorMessage = error.error.error.message;
            this.authenticationFailed = true;
          }

          // Do this so the error will be logged by the ApplicationErrorHandler.
          throw error;
        }});
  }

  private login(emailAddress: string, password: string) {
    this.userService.login(emailAddress, password)
      .subscribe({
        next: response => {
          //throw new Error('An error has occurred');

          const returnUrl = this.activatedRoute.snapshot.queryParams['return'];
          
          if (returnUrl) {
            this.router.navigate([decodeURIComponent(returnUrl)]);
          }
          else {
            this.router.navigate(['/groups']);
          }
        },
        error: error => {
          if (error.status === 401) {
            this.errorMessage = error.error.error.message;
            this.authenticationFailed = true;
          }

          // Do this so the error will be logged by the ApplicationErrorHandler.
          throw error;
        }});
  }
}
