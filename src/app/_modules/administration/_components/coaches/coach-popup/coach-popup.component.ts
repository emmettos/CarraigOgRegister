import { Component, Input } from '@angular/core';

import { ICoach } from '../../../../../_models/index';


@Component({
  templateUrl: './coach-popup.component.html',
  styleUrls: ['./coach-popup.component.css']
})
export class CoachPopupComponent {
  @Input()
  coachDetails: ICoach;

  @Input()
  coachGroups: any[];

  constructor() {
  }

  coachPopupHeaderCSSClass() {
    var CSSClass = 'bg-success';

    if (!this.coachDetails.active) {
      CSSClass = 'bg-warning';
    }

    return CSSClass;
  }

  coachPopupFooterCSSClass() {
    var CSSClass = 'bg-success-light';

    if (!this.coachDetails.active) {
      CSSClass = 'bg-warning-light';
    }

    return CSSClass;
  }
}
