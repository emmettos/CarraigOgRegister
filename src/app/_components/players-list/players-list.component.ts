import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../_helpers/index';
import { IPlayer, PlayerState } from '../../_models/index';
import { AlertService, PlayersService } from '../../_services/index';


@Component({
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  filterForm: FormGroup;

  nameFilterControl: FormControl;
  currentlyRegisteredControl: FormControl;

  groupName: string = null;
  view: string = null;

  sortKey: string = "surname";
  reverse: boolean = false;

  players: IPlayer[] = null;
  filteredPlayers: IPlayer[] = null;

  selectedPlayer: IPlayer = null;

  registeredCount: number = 0;
  newCount: number = 0;
  missingCount: number = 0;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService, 
    private playersService: PlayersService) {
  }

  ngOnInit() {
    this.nameFilterControl = new FormControl();
    this.currentlyRegisteredControl = new FormControl(false);

    this.filterForm = new FormGroup({
      nameFilter: this.nameFilterControl,
      currentlyRegistered: this.currentlyRegisteredControl
    });

    this.filterForm.valueChanges
      .subscribe(
          (formValues) => { 
            this.filterPlayers(formValues)
          });

    this.groupName = this.activatedRoute.snapshot.paramMap.get("groupName");

    let yearOfBirth: number = +this.activatedRoute.snapshot.paramMap.get("yearOfBirth");

    this.playersService.readCurrentPlayers(yearOfBirth)
      .subscribe(
        response => {
          let playerIndex = 0;

          this.players = response.body.players;

          for (playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
              if (this.players[playerIndex].lastRegisteredYear === APP_SETTINGS.currentYear) {
                  this.registeredCount++;

                  if (this.players[playerIndex].registeredYears.length === 1) {
                      this.players[playerIndex].playerState = PlayerState.New;

                      this.newCount++;
                  }
                  else {
                      this.players[playerIndex].playerState = PlayerState.Existing;
                  }
              }
              else {
                  this.players[playerIndex].playerState = PlayerState.Missing;

                  this.missingCount++;
              }
          }

          this.players
            .sort(
              (player1: IPlayer, player2: IPlayer) => {
                let returnValue: number = 1;
    
                if (player1._id < player2._id) {
                  returnValue = -1;
                }
                else if (player1._id === player2._id) {
                  returnValue = 0;
                }
                
                return returnValue;
              });
    
          this.filteredPlayers = this.players.slice(0);
        },
        errorResponse => {
          console.error(errorResponse);

          this.alertService.error(errorResponse.error);
        });
  }

  filterPlayers(formValues: any) {
    this.filteredPlayers = this.players
      .filter(
        player => {
          let nameFilter = formValues.nameFilter;

          if (nameFilter === null) {
            nameFilter = '';
          }

          if ((player.firstName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
              player.surname.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1)
                && 
              !(formValues.currentlyRegistered && player.lastRegisteredYear !== APP_SETTINGS.currentYear)) {
            return true;
          }
        });
    
    this.onClickHeader(this.sortKey, false);
  }

  onClickHeader(newSortKey: string, flipSort: boolean = true) {
    if (this.sortKey === newSortKey) {
      if (flipSort) {
        this.reverse = !this.reverse;
      }
    }
    else {
      this.sortKey = newSortKey;
      this.reverse = false;
    }
    
    this.filteredPlayers
      .sort(
        (player1: IPlayer, player2: IPlayer) => {
          let returnValue: number = 1;

          if (player1[this.sortKey] < player2[this.sortKey]) {
            returnValue = -1;
          }
          else if (player1[this.sortKey] === player2[this.sortKey]) {
            returnValue = 0;
          }

          if (this.reverse) {
            returnValue = returnValue * -1;
          }
          
          return returnValue;
        });
  }

  onClickRow(content: any, playerId: string) {
    let search = (players, targetPlayerId, startIndex, endIndex) => {
      let middleIndex = Math.floor((startIndex + endIndex) / 2);

      if (targetPlayerId === players[middleIndex]._id) {
        return players[middleIndex];
      }

      if (targetPlayerId > players[middleIndex]._id) {
        return search(players, playerId, middleIndex, endIndex);
      }
      if (targetPlayerId < players[middleIndex]._id) {
        return search(players, playerId, startIndex, middleIndex);
      }
    };

    this.selectedPlayer = search(this.players, playerId, 0, this.players.length - 1);

    this.modalService.open(content);
  }

  headerSortCSSClass(keyName) {
    var CSSClass = "fa fa-sort";

    if (this.sortKey === keyName) {
      if (this.reverse) {
        CSSClass = "fa fa-sort-desc";
      }
      else {
        CSSClass = "fa fa-sort-asc";
      }
    }

    return CSSClass;
  };

  playerStateCSSClass(player: any) {
    var CSSClass = 'badge-info';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'badge-success';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'badge-warning';               
    }

    return CSSClass;
  }
}
