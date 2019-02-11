import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlayerSummary } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services/index';


@Component({
  templateUrl: './confirm-delete-player.component.html',
  styleUrls: ['./confirm-delete-player.component.css']
})
export class ConfirmDeletePlayerComponent implements OnInit {
  @Input()
  playerSummary: IPlayerSummary;

  deletePlayerForm: FormGroup;

  deletingPlayer: Boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private playersService: PlayersService) {
  }

  ngOnInit() {
    this.deletePlayerForm = this.formBuilder.group({});
  }

  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.playersService.deletePlayer(this.playerSummary)
      .subscribe({
        next: response => {
          let returnObject: any = {}

          returnObject.matchedPlayers = response.body.players;

          this.activeModal.close(returnObject);
        },
        error: error => {
          this.activeModal.dismiss();
        }
      });

    this.deletingPlayer = true;
  }
}
