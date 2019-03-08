import { Component, Input } from '@angular/core';

import { IGroup } from '../../../../../_models/index';


@Component({
  templateUrl: './group-popup.component.html',
  styleUrls: ['./group-popup.component.css']
})
export class GroupPopupComponent {
  @Input()
  groupDetails: IGroup;

  @Input()
  footballCoachFullName: string;

  @Input()
  hurlingCoachFullName: string;

  @Input()
  numberOfPlayers: number;

  @Input()
  lastUpdatedDate: string;

  constructor() {
  }

  groupPopupHeaderCSSClass() {
    var CSSClass = 'bg-success';

    if (this.numberOfPlayers === 0) {
      CSSClass = 'bg-warning';
    }

    return CSSClass;
  }

  groupPopupFooterCSSClass() {
    var CSSClass = 'bg-success-light';

    if (this.numberOfPlayers === 0) {
      CSSClass = 'bg-warning-light';
    }

    return CSSClass;
  }
}
