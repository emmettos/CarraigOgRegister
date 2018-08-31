import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationService } from '../../_services/index';

@Component({
  selector: 'app-validation-message',
  template: `<div id="validation-message" class="invalid-feedback" [style.display]="getValidationMessage ? 'inline': 'none'">{{ getValidationMessage }}</div>`
})
export class ValidationMessageComponent {
  @Input() 
  control: FormControl;

  constructor(private validationService: ValidationService) {
  }

  get getValidationMessage() {
    if (this.control.touched) {      
      for (let errorName in this.control.errors) {
        return this.validationService.validationMessage(errorName, this.control.errors[errorName]);
      }
    }
  }
}
