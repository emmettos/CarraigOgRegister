import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ICoach } from '../../../_models';


@Injectable()
export class ValidationService {
  private validationMessages;

  constructor() {
    this.validationMessages = {
      'invalidConfirmPassword': 'The Confirm Password does not match the Password',
      'invalidEmailAddress': 'Invalid email address',
      'invalidDatePicker': 'This field is required',
      'invalidGroup': 'Select a group',
      'invalidNewCoach': 'A coach with this email address already exists',
      'minlength': 'Minimum length [requiredLength]',
      'required': 'This field is required'
    };  
  }

  datePickerValidator(control: FormControl): {[key: string]: any} {
    if (control.value && control.value !== 'yyyy-MM-dd') {
      return null;
    }
      
    return { 'invalidDatePicker': true };
  }

  emailValidator(control: FormControl): {[key: string]: any} {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    }
      
    return { 'invalidEmailAddress': true };
  }

  groupValidator(control: FormControl): {[key: string]: any} {
    if (control.value !== 'Not Registered') {
      return null;
    }
      
    return { 'invalidGroup': true };
  }

  passwordMatchValidator(controlToMatch: FormControl) {
    return (control: FormControl): {[key: string]: any} => {
      if (control.value === controlToMatch.value) {
        return null;
      }
      
      return { 'invalidConfirmPassword': true };
    }
  }

  newCoachValidator(currentCoaches: ICoach[]) {
    return (control: FormControl): {[key: string]: any} => {
      if (!currentCoaches) {
        return null;
      }
      
      let existingCoach: ICoach = currentCoaches.find(coach => {
        return coach.emailAddress === control.value;
      });

      if (!existingCoach) {
        return null;
      }
      
      return { 'invalidNewCoach': true };
    }
  }

  validationMessage(validatorName: string, errorObject?: any): string {
    let message: string = null;

    switch (validatorName) {
      case ('minlength'): {
        message = this.validationMessages[validatorName].replace('[requiredLength]', errorObject.requiredLength);      
      
        break;
      }
      default:
        message = this.validationMessages[validatorName];      
    }

    return message;
  }
}
