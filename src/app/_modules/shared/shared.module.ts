import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
  
import { AlertComponent } from './_components/alert/alert.component';
import { ValidationMessageComponent } from './_components/validation-message/validation-message.component';

import { 
  AlertService, 
  ValidationService } from './_services/index';


@NgModule({
  declarations: [
    AlertComponent,
    ValidationMessageComponent,
  ],
  imports: [
    CommonModule
  ],
  providers: [
    AlertService,
    ValidationService
  ],
  exports: [
    AlertComponent,
    ValidationMessageComponent    
  ]
})
export class SharedModule { }
