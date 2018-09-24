import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { APP_SETTINGS } from '../../_helpers/index';
import { IPlayer, PlayerState } from '../../_models/index';
import { PlayersService } from '../../_services/index';


@Component({
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  playerState = PlayerState;
  
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
      .subscribe({
        next: response => {
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

          this.onClickHeader(this.sortKey, false);
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
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
    let startIndex = 0,
        endIndex = this.players.length - 1,
        middleIndex = Math.floor((startIndex + endIndex) / 2)

    while (this.players[middleIndex]._id !== playerId && startIndex < endIndex) {
      if (playerId < this.players[middleIndex]._id) {
        endIndex = middleIndex - 1
      } else {
        startIndex = middleIndex + 1
      }

      middleIndex = Math.floor((startIndex + endIndex) / 2)
    }

    this.selectedPlayer = this.players[middleIndex];

    this.modalService.open(content);
  }

  onClickDownloadCSV() {
    let csvPlayers: any[] = [];

    this.filteredPlayers.forEach(player => {
      let csvPLayer: any = {};
      
      csvPLayer.surname = player.surname;
      csvPLayer.firstName = player.firstName;
      csvPLayer.addressLine1 = player.addressLine1;
      csvPLayer.addressLine2 = player.addressLine2;
      csvPLayer.addressLine3 = player.addressLine3;
      csvPLayer.dateOfBirth = moment.utc(player.dateOfBirth).format("YYYY-MM-DD");
      csvPLayer.lastRegisteredDate = moment.utc(player.lastRegisteredDate).format("YYYY-MM-DD");
      csvPLayer.medicalConditions = player.medicalConditions;
      csvPLayer.contactName = player.contactName;
      csvPLayer.contactEmailAddress = player.contactEmailAddress;
      csvPLayer.contactMobileNumber = player.contactMobileNumber;
      csvPLayer.contactHomeNumber = player.contactHomeNumber;
      csvPLayer.school = player.school;

      csvPlayers.push(csvPLayer);
    });

    this.playersService.downloadCSV(csvPlayers);
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

  playerStateCSSClass(player: IPlayer) {
    var CSSClass = 'badge-info';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'badge-success';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'badge-warning';               
    }

    return CSSClass;
  }

  playerPopupHeaderCSSClass(player: IPlayer) {
    if (!player) {
      return;
    }

    var CSSClass = 'bg-info';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'bg-success';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'bg-warning';
    }

    return CSSClass;
  }

  playerPopupFooterCSSClass(player: IPlayer) {
    if (!player) {
      return;
    }
    
    var CSSClass = 'bg-info-light';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'bg-success-light';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'bg-warning-light';
    }

    return CSSClass;
  }
}
