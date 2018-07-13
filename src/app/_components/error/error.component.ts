import { Component, ErrorHandler, OnInit } from '@angular/core';

import { ApplicationErrorHandlerService } from '../../_services/index';


@Component({
  styleUrls: ['./error.component.css'],
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
  public applicationErrorHandlerService: ApplicationErrorHandlerService;
  public stackString: string;

  constructor(private errorHandler: ErrorHandler) { 
    this.applicationErrorHandlerService = this.errorHandler as ApplicationErrorHandlerService;
  }

  ngOnInit() {
    this.applicationErrorHandlerService.getStackString
      .subscribe(
        stackString => {
          this.stackString = stackString;
        });
  }
}
