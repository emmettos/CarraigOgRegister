import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';


@Injectable()
export class ValidationService {
  private validationMessages;

  constructor() {
    this.validationMessages = {
      'invalidConfirmPassword': 'The new passwords do not match',
      'invalidEmailAddress': 'Invalid email address',
      'minlength': 'Minimum length [requiredLength]',
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

  passwordMatchValidator(controlToMatch) {
    return (control: FormControl): {[key: string]: any} => {
      if (control.value === controlToMatch.value) {
        return null;
      }
      
      return { 'invalidConfirmPassword': true };
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
