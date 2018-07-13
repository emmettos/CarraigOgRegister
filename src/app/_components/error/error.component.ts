import { Component, ErrorHandler, OnInit } from '@angular/core';

import { ApplicationErrorHandlerService } from '../../_services/index';


@Component({
  styleUrls: ['./error.component.css'],
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
  private stackString: string;

  constructor(private errorHandler: ErrorHandler) { 
  }

  ngOnInit() {
    (this.errorHandler as ApplicationErrorHandlerService).getStackString
      .subscribe(
        stackString => {
          this.stackString = stackString;
        });
  }
}
