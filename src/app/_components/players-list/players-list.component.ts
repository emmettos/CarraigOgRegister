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
      .subscribe(formValues => { 
        this.filterPlayers(formValues)
      });

    this.groupName = this.activatedRoute.snapshot.paramMap.get("groupName");

    let yearOfBirth: number = +this.activatedRoute.snapshot.paramMap.get("yearOfBirth");

    this.playersService.readCurrentPlayers(yearOfBirth)
      .subscribe({
        next: response => {
          this.players = response.body.players;

          this.players.forEach(player => {
            if (player.lastRegisteredYear === APP_SETTINGS.currentYear) {
              this.registeredCount++;

              if (player.registeredYears.length === 1) {
                player.playerState = PlayerState.New;

                this.newCount++;
              }
              else {
                player.playerState = PlayerState.Existing;
              }
            }
            else {
              player.playerState = PlayerState.Missing;

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
      .sort((player1: IPlayer, player2: IPlayer) => {
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

  onClickRow(content: any, player: IPlayer) {
    this.selectedPlayer = player;

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
