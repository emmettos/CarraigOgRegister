import { Component, OnInit } from '@angular/core';

import { AlertService } from '../../_services/index';


@Component({
  selector: 'app-alert',
  styleUrls: ['./alert.component.css'],
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  alert: any;

  constructor(private alertService: AlertService) { 
  }

  ngOnInit() {
    this.alertService.getAlertStream
      .subscribe(
        alert => {
          this.alert = alert;
        });
  }
}
