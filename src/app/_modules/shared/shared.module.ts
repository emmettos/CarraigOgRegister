import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UtcDatePipe } from './_pipes/utc-date.pipe';

import { ValidationService } from './_services/index';

import { ValidationMessageComponent } from './_components/validation-message/validation-message.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    UtcDatePipe,
    PageNotFoundComponent,
    ValidationMessageComponent,
  ],
  exports: [
    UtcDatePipe,
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
