import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './_components/alert/alert.component';
import { DatePickerComponent } from './_components/date-picker/date-picker.component';
import { ValidationMessageComponent } from './_components/validation-message/validation-message.component';

import { 
  AlertService, 
  ValidationService } from './_services/index';


@NgModule({
  declarations: [
    AlertComponent,
    DatePickerComponent,
    ValidationMessageComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    AlertService,
    ValidationService
  ],
  exports: [
    AlertComponent,
    DatePickerComponent,
    ValidationMessageComponent    
  ]
})
export class SharedModule { }
