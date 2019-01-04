import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { APP_SETTINGS } from '../../_helpers/index';
import { IPlayerSummary, PlayerState } from '../../_models/index';
import { PlayersService } from '../../_services/index';


@Component({
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
  // This is used by the html.
  playerState = PlayerState;
  
  filterForm: FormGroup;

  nameFilterControl: FormControl;
  currentlyRegisteredControl: FormControl;

  groupName: string = null;

  sortKey: string = "surname";
  reverse: boolean = false;

  players: IPlayerSummary[] = null;
  filteredPlayers: IPlayerSummary[] = null;

  selectedPlayer: IPlayerSummary = null;

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
      .subscribe(formValues => { 
        this.filterPlayers(formValues)
      });

    this.groupName = this.activatedRoute.snapshot.paramMap.get("groupName");

    let yearOfBirth: number = +this.activatedRoute.snapshot.paramMap.get("yearOfBirth");

    this.playersService.readPlayerSummaries(yearOfBirth)
      .subscribe({
        next: response => {
          this.players = response.body.players;

          this.players.forEach(player => {
            if (player.playerState === PlayerState.Existing || player.playerState === PlayerState.New) {
              this.registeredCount++;

              if (player.playerState === PlayerState.New) {
                this.newCount++;
              }
            }
            else {
              this.missingCount++;
            }
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
      .sort((player1: IPlayerSummary, player2: IPlayerSummary) => {
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

  onClickRow(content: any, player: IPlayerSummary) {
    this.selectedPlayer = player;

    this.modalService.open(content);
  }

  onClickDownloadCSV() {
    let csvPlayers: any[] = [];

    this.filteredPlayers.forEach(player => {
      let csvPlayer: any = {};
      
      csvPlayer.surname = player.surname;
      csvPlayer.firstName = player.firstName;
      csvPlayer.addressLine1 = player.addressLine1;
      csvPlayer.addressLine2 = player.addressLine2;
      csvPlayer.addressLine3 = player.addressLine3;
      csvPlayer.dateOfBirth = moment.utc(player.dateOfBirth).format("YYYY-MM-DD");
      csvPlayer.lastRegisteredDate = moment.utc(player.lastRegisteredDate).format("YYYY-MM-DD");
      csvPlayer.medicalConditions = player.medicalConditions;
      csvPlayer.contactName = player.contactName;
      csvPlayer.contactEmailAddress = player.contactEmailAddress;
      csvPlayer.contactMobileNumber = player.contactMobileNumber;
      csvPlayer.contactHomeNumber = player.contactHomeNumber;
      csvPlayer.school = player.school;

      csvPlayers.push(csvPlayer);
    });

    this.playersService.downloadCSV(csvPlayers);
  }

  // This is public for the unit tests.
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
              !(formValues.currentlyRegistered && player.playerState === PlayerState.Missing)) {
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

  playerStateCSSClass(player: IPlayerSummary) {
    var CSSClass = 'badge-info';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'badge-success';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'badge-warning';               
    }

    return CSSClass;
  }

  playerPopupHeaderCSSClass(player: IPlayerSummary) {
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

  playerPopupFooterCSSClass(player: IPlayerSummary) {
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
