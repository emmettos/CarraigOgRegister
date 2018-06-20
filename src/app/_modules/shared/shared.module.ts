import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DatePickerComponent } from './_components/date-picker/date-picker.component';
import { ValidationMessageComponent } from './_components/validation-message/validation-message.component';

import { ValidationService } from './_services/index';


@NgModule({
  declarations: [
    DatePickerComponent,
    ValidationMessageComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    ValidationService
  ],
  exports: [
    DatePickerComponent,
    ValidationMessageComponent    
  ]
})
export class SharedModule { }
