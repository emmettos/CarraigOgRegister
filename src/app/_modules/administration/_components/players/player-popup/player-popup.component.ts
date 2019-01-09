import { Component, Input } from '@angular/core';

import { IPlayer, PlayerState } from '../../../../../_models/index';


@Component({
  templateUrl: './player-popup.component.html',
  styleUrls: ['./player-popup.component.css']
})
export class PlayerPopupComponent {
  @Input()
  playerDetails: IPlayer;

  @Input()
  groupPlayerDetails: any;

  @Input()
  playerState: PlayerState;

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
