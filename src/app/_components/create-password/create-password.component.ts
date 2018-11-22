import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../_services/index';
import { ValidationService } from '../../_modules/shared/_services/index';


@Component({
  styleUrls: ['./create-password.component.css'],
  templateUrl: './create-password.component.html'
})
export class CreatePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;

  passwordControl: FormControl;
  confirmPasswordControl: FormControl;

  emailAddress: string = null;

  creatingPassword: boolean = false;
  passwordCreated: boolean = false;
  errorMessage: string = null;
  tokenFailed: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {   
  }

  ngOnInit() {
    this.passwordControl = new FormControl('', [Validators.minLength(5), Validators.required]);
    this.confirmPasswordControl = new FormControl('', [Validators.minLength(5), Validators.required, this.validationService.passwordMatchValidator(this.passwordControl)]);
    
    // TODO: Figure out how to get both password fields validating against each other.
    //this.passwordControl.setValidators([Validators.minLength(5), Validators.required, this.validationService.passwordMatchValidator(this.confirmPasswordControl)]);

    this.createPasswordForm = this.formBuilder.group({
      'password': this.passwordControl,
      'confirmPassword': this.confirmPasswordControl
    });

    this.disableControls();

    this.userService.verifyUserToken(this.activatedRoute.snapshot.paramMap.get('userToken'))
      .subscribe({
        next: response => {
          this.emailAddress = response.body.emailAddress;

          this.enableControls();
        },
        error: error => {
          if (error.status === 401) {
            this.errorMessage = error.error.error.message;
            this.tokenFailed = true;
          }
        }
      });
  }

  onSubmit(formValues) {
    if (this.createPasswordForm.invalid) {
      return;
    }

    this.userService.createPassword(this.emailAddress, formValues.password)
      .subscribe({
        next: response => {
          this.passwordCreated = true;
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });

    this.creatingPassword = true;

    this.disableControls();
  }

  private disableControls(): void {
    this.passwordControl.disable();
    this.confirmPasswordControl.disable();
  }

  private enableControls(): void {
    this.passwordControl.enable();
    this.confirmPasswordControl.enable();
  }
}
