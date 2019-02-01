import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { NgbModal, NgbModalRef, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import * as moment from 'moment';

import { IPlayer, IPlayerSummary, PlayerState, IGroup } from '../../../../../_models/index';
import { PlayersService, GroupsService } from '../../../../../_services/index';
import { PlayerFormComponent } from '../player-form/player-form.component';
import { PlayerPopupComponent } from '../player-popup/player-popup.component';


@Component({
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.css']
})
export class ManagePlayersComponent implements OnInit {
  @ViewChild('dateOfBirthPicker') 
  dateOfBirthPicker: NgbDatepicker;

  managePlayersForm: FormGroup;

  // These are used by the html.
  formState = FormState;
  playerState = PlayerState;

  currentState: FormState = FormState.SearchForPlayer;

  groups: IGroup[] = null;

  dateOfBirth: moment.Moment = null;

  matchedPlayers: IPlayerSummary[] = null;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private playersService: PlayersService,
    private groupsService: GroupsService) {
  }

  ngOnInit() {
    this.managePlayersForm = this.formBuilder.group({
      'dateOfBirth': ['', Validators.required]
    });

    this.groupsService.readGroups()
      .subscribe({
        next: response => {
          this.groups = response.body.groups;

          if (this.groups.length === 0) {
            this.toasterService.pop('warning', 'No Groups Found', 'Please add some groups');

            this.managePlayersForm.controls['dateOfBirth'].disable();
          }
          else {
            this.dateOfBirthPicker.minDate = { year: this.groups[this.groups.length - 1].yearOfBirth - 1, month: 1, day: 1 };
            this.dateOfBirthPicker.maxDate = { year: this.groups[0].yearOfBirth, month: 12, day: 31 };

            let startYear: number = this.groups[this.groups.length - 1].yearOfBirth 
                                      + Math.floor((this.groups[0].yearOfBirth - this.groups[this.groups.length - 1].yearOfBirth) / 2);
            
            this.dateOfBirthPicker.startDate = { year: startYear, month: 6 };
          }
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }

  onDateOfBirthChange() {
    this.currentState = FormState.SearchForPlayer;
  }

  onDateOfBirthPickerChange(date: NgbDate) {
    this.dateOfBirthPicker.startDate = null;

    this.currentState = FormState.SearchForPlayer;
  }

  onSubmit(formValues: any) {
    let dobPicker = formValues.dateOfBirth,
        localeDateOfBirth = new Date(dobPicker.year, dobPicker.month - 1, dobPicker.day);

    this.dateOfBirth = moment.utc(localeDateOfBirth).add(0 - localeDateOfBirth.getTimezoneOffset(), "m");

    this.playersService.searchPlayers(this.dateOfBirth.toISOString())
      .subscribe({
        next: response => {
          this.matchedPlayers = response.body.players;

          this.matchedPlayers.sort(
            (player1: IPlayerSummary, player2: IPlayerSummary) => {
              let returnValue: number = 1;

              if (player1.surname < player2.surname) {
                returnValue = -1;
              }
              else if (player1.surname === player2.surname) {
                returnValue = 0;
              }
              
              return returnValue;
            });

          if (this.matchedPlayers.length > 0) {
            this.currentState = FormState.PlayersFound;
          }
          else {
            this.currentState = FormState.NoPlayersFound;
          }
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }

  onClickAddPlayer() {
    const modalRef: NgbModalRef = this.modalService.open(PlayerFormComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.dateOfBirth = this.dateOfBirth;
    modalRef.componentInstance.groups = this.groups;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Player Successfully Added', returnObject.playerDetails.firstName + ' ' + returnObject.playerDetails.surname);
          this.currentState = FormState.SearchForPlayer;
        }
      })
      .catch(error => {
        this.currentState = FormState.SearchForPlayer;
      });
  }

  onClickEditPlayer(event: Event, playerSummary: IPlayerSummary) {
    this.playersService.readPlayerDetails(playerSummary.id)
      .subscribe({
        next: response => {
          const modalRef: NgbModalRef = this.modalService.open(PlayerFormComponent, { size: 'lg', backdrop: 'static' });

          modalRef.componentInstance.playerDetails = response.body.playerDetails;
          modalRef.componentInstance.groupPlayerDetails = response.body.groupPlayerDetails;
          modalRef.componentInstance.groups = this.groups;
          modalRef.componentInstance.playerState = playerSummary.playerState;

          modalRef.result
            .then(returnObject => {
              if (returnObject) {
                this.toasterService.pop('success', 'Player Successfully Updated', returnObject.playerDetails.firstName + ' ' + returnObject.playerDetails.surname);
                this.currentState = FormState.SearchForPlayer;
              }
            })
            .catch(error => {
              this.currentState = FormState.SearchForPlayer;
            });
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
    
    event.stopPropagation();
  }

  onClickDeletePlayer(event: Event, playerId: number) {
    // const modalRef: NgbModalRef = this.modalService.open(ConfirmDeleteCoachComponent, { backdrop: 'static' });

    // modalRef.componentInstance.coachDetails = coach;

    // modalRef.result
    //   .then(returnObject => {
    //     if (returnObject) {
    //       this.toasterService.pop('success', 'Coach Successfully Deleted', returnObject.coachDetails.emailAddress);

    //       this.processReturnedCoaches(returnObject.updatedCoaches);
    //     }

    //     this.nameFilterElementRef.nativeElement.focus();
    //   })
    //   .catch(error => {
    //     this.toasterService.pop('error', 'Failed Deleting Coach', error.coachDetails.emailAddress);
    //   });

    event.stopPropagation();
  }

  onClickRow(playerSummary: IPlayerSummary) {
    this.playersService.readPlayerDetails(playerSummary.id)
      .subscribe({
        next: response => {
          let modalRef: NgbModalRef = this.modalService.open(PlayerPopupComponent);

          modalRef.componentInstance.playerDetails = response.body.playerDetails;
          modalRef.componentInstance.playerState = playerSummary.playerState;

          if (response.body.groupPlayerDetails) {      
            modalRef.componentInstance.groupName = this.groups.find(group => { 
              return group.id === response.body.groupPlayerDetails.groupId 
            }).name;
          }
          else {
            modalRef.componentInstance.groupName = "No current group"
          }
          modalRef.componentInstance.lastRegisteredDate = playerSummary.lastRegisteredDate;
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }

  playerStateCSSClass(player: IPlayerSummary) {
    var CSSClass = 'badge-info';

    if (player.playerState === PlayerState.New) {
        CSSClass = 'badge-success';
    }
    else if (player.playerState === PlayerState.Missing) {
        CSSClass = 'badge-warning';
    }
    else if (player.playerState === PlayerState.Gone) {
      CSSClass = 'badge-error';
    }

    return CSSClass;
  }
}

enum FormState {
  SearchForPlayer,
  PlayersFound,
  NoPlayersFound
}