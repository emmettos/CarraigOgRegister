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
export class PlayerPopupComponent implements OnInit {
  @Input()
  playerDetails: IPlayer;

  @Input()
  groupPlayerDetails: IGroupPlayer;

  @Input()
  playerState: PlayerState;

  @Input()
  group: IGroupSummary;

  groupName: string;

  constructor() {
  }

  ngOnInit() {
    if (this.group) {
      this.groupName = this.group.name;
    }
    else {
      this.groupName = "No current group"
    }
  }

  playerPopupHeaderCSSClass() {
    var CSSClass = 'bg-info';

    if (this.playerState === PlayerState.New) {
        CSSClass = 'bg-success';
    }
    else if (this.playerState === PlayerState.Missing) {
        CSSClass = 'bg-warning';               
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

    return CSSClass;
  }
}
