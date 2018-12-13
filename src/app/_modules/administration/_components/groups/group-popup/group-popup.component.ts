import { Component, Input } from '@angular/core';

import { IGroup } from '../../../../../_models/index';


@Component({
  templateUrl: './group-popup.component.html',
  styleUrls: ['./group-popup.component.css']
})
export class GroupPopupComponent {
  @Input()
  groupDetails: IGroup;

  constructor() {
  }
}
