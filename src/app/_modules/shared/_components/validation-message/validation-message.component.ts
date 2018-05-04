import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationService } from '../../_services/index';


@Component({
  selector: 'validation-message',
  template: `<div class="invalid-feedback" [hidden]="!validationMessage">{{ validationMessage }}</div>`
})
export class ValidationMessageComponent {
  @Input() control: FormControl;

  constructor(private validationService: ValidationService) {
  }

  get validationMessage() {
    if (this.control.touched) {      
      for (let errorName in this.control.errors) {
        return this.validationService.validationMessage(errorName, this.control.errors[errorName]);
      }
    }
  }
}
