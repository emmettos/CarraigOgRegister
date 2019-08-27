import { Component, Input, OnInit } from '@angular/core';

import { 
  IPlayer, 
  IGroupSummary, 
  IGroupPlayer, 
  PlayerState } from '../../../../../_models/index';


@Component({
  templateUrl: './player-popup.component.html',
  styleUrls: ['./player-popup.component.css']
})
export class PlayerPopupComponent {
  @Input()
  playerDetails: IPlayer;

  @Input()
  playerState: PlayerState;

  @Input()
  groupName: string;

  @Input()
  lastRegisteredDate: string;

  constructor() {
  }

  playerPopupHeaderCSSClass() {
    var CSSClass = 'bg-info';

    if (this.playerState === PlayerState.New) {
        CSSClass = 'bg-success';
    }
    else if (this.playerState === PlayerState.Missing) {
        CSSClass = 'bg-warning';
    }
    else if (this.playerState === PlayerState.Gone) {
      CSSClass = 'bg-danger';
    }

    return CSSClass;
  }

  playerPopupFooterCSSClass() {
    var CSSClass = 'bg-info-light';

    if (this.playerState === PlayerState.New) {
        CSSClass = 'bg-success-light';
    }
    else if (this.playerState === PlayerState.Missing) {
        CSSClass = 'bg-warning-light';
    }
    else if (this.playerState === PlayerState.Gone) {
      CSSClass = 'bg-danger-light';
    }

    return CSSClass;
  }
}
