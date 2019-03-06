import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ICoachSummary } from '../../../_models';


@Injectable()
export class ValidationService {
  private validationMessages;

  constructor() {
    this.validationMessages = {
      'invalidConfirmPassword': 'The Confirm Password does not match the Password',
      'invalidEmailAddress': 'Invalid email address',
      'selectGroup': 'Select a group',
      'selectYearOfBirth': 'Select a year',
      'invalidNewCoach': 'A coach with this email address already exists',
      'minlength': 'Minimum length [requiredLength]',
      'ngbDate': 'Invalid date/Out of range',
      'invalidDate': 'Invalid date/Out of range',
      'required': 'This field is required'
    };  
  }

  emailValidator(control: FormControl): {[key: string]: any} {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    }
      
    return { 'invalidEmailAddress': true };
  }

  registeredDateValidator(controlToMatch: FormControl) {
    return (control: FormControl): {[key: string]: any} => {
      if (!control.value) {
        if (controlToMatch.value === '0') {
          return null;
        }
          
        return { 'required': true };
      }

      if (typeof control.value === 'object' && control.value.constructor === Object) {
        let controlDate: Date = new Date(control.value.year, control.value.month - 1, control.value.day);

        if ((control['minDate'] && controlDate < control['minDate']) || (control['maxDate'] && controlDate > control['maxDate'])) {
          return { 'invalidDate': true };
        }

        return null;
      }

      return { 'invalidDate': true };
    }
  }

  groupValidator(control: FormControl): {[key: string]: any} {
    if (control.value !== '0') {
      return null;
    }
      
    return { 'selectGroup': true };
  }

  yearOfBirthValidator(control: FormControl): {[key: string]: any} {
    if (control.value !== '0') {
      return null;
    }
      
    return { 'selectYearOfBirth': true };
  }

  passwordMatchValidator(controlToMatch: FormControl) {
    return (control: FormControl): {[key: string]: any} => {
      if (control.value === controlToMatch.value) {
        return null;
      }
      
      return { 'invalidConfirmPassword': true };
    }
  }

  newCoachValidator(currentCoaches: ICoachSummary[]) {
    return (control: FormControl): {[key: string]: any} => {
      if (!currentCoaches) {
        return null;
      }
      
      let existingCoach: ICoachSummary = currentCoaches.find(coach => {
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
