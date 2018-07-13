import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ValidationService } from './_services/index';

import { DatePickerComponent } from './_components/date-picker/date-picker.component';
import { ValidationMessageComponent } from './_components/validation-message/validation-message.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    DatePickerComponent,
    PageNotFoundComponent,
    ValidationMessageComponent,
  ],
  exports: [
    DatePickerComponent,
    PageNotFoundComponent,
    ValidationMessageComponent    
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    ValidationService
  ]
})
export class SharedModule { }
