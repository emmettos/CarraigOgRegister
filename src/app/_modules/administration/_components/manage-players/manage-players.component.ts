import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import * as moment from 'moment';

import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../_helpers/app.initializer.helper';
import { IPlayer } from '../../../../_models/index';
import { PlayersService } from '../../../../_services/index';
import { ValidationService } from '../../../shared/_services/index';


@Component({
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.css']
})
export class ManagePlayersComponent implements OnInit {
  managePlayersForm: FormGroup;

  formState = FormState;
  currentState: FormState = FormState.SearchForPlayer;

  groupYears: any[] = null;
  groupYear: any = 'Select Year';

  dateOfBirthPickerLabel: string;
  dateOfBirthPickerEnabled: boolean;
  dateOfBirthPickerMinDate: NgbDateStruct;
  dateOfBirthPickerMaxDate: NgbDateStruct;
  dateOfBirthPickerStartDate: any;

  lastRegisteredDatePickerLabel: string;
  lastRegisteredDatePickerEnabled: boolean;
  lastRegisteredDatePickerMinDate: NgbDateStruct;
  lastRegisteredDatePickerMaxDate: NgbDateStruct;
  lastRegisteredDatePickerStartDate: any;

  groupPlayers: IPlayer[] = null;
  matchedPlayers: IPlayer[] = null;

  playerDetails: IPlayer = (<IPlayer>{});

  constructor(
    private formBuilder: FormBuilder,
    private playersService: PlayersService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this.groupYears = JSON.parse(JSON.stringify(APP_SETTINGS.groupYears));
    this.groupYears.unshift('Select Year');

    this.managePlayersForm = this.formBuilder.group({
      'groupYear': ['Select Year', this.validationService.groupYearValidator],
      'dateOfBirthPicker': this.formBuilder.group({}),
      'lastRegisteredDatePicker': this.formBuilder.group({}),
      'firstName': [{ value: '', disabled: true }, Validators.required],
      'surname': [{ value: '', disabled: true }, Validators.required],
      'addressLine1': [{ value: '', disabled: true }, Validators.required],
      'addressLine2': [{ value: '', disabled: true }],
      'addressLine3': [{ value: '', disabled: true }],
      'school': [{ value: '', disabled: true }],
      'medicalConditions': [{ value: '', disabled: true }],
      'contactName': [{ value: '', disabled: true }],
      'contactEmailAddress': [{ value: '', disabled: true }],
      'contactMobileNumber': [{ value: '', disabled: true }],
      'contactHomeNumber': [{ value: '', disabled: true }]
    });

    this.dateOfBirthPickerEnabled = false;

    this.lastRegisteredDatePickerLabel = "Last Registered Date";
    this.lastRegisteredDatePickerEnabled = false;
  }

  onChangeGroupYear(groupYear: string) {
    this.groupYear = groupYear;

    this.groupPlayers = null;

    if (groupYear !== 'Select Year') {
      this.playersService.readAllPlayers(+groupYear)
        .subscribe({
          next: response => {
            this.groupPlayers = response.body.players;
          },
          // Need this handler otherwise the Angular error handling mechanism will kick in.
          error: error => {
          }
        });
    }

    this.playerDetails = (<IPlayer>{});

    this.processEvent(FormEvent.YearChanged);
  }

  onDateOfBirthPickerChange(dateOfBirth) {
    this.processEvent(FormEvent.DateOfBirthChanged);
  }

  onSearchPlayers() {
    let dobPicker = this.managePlayersForm.controls['dateOfBirthPicker'].value.datePickerTextBox,
        dobDateString = dobPicker.year + '-' + dobPicker.month.toString().padStart(2, '0') + '-' + dobPicker.day.toString().padStart(2, '0'),
        dateOfBirth = new Date(dobDateString + 'T00:00:00.000Z');

    this.matchedPlayers = this.groupPlayers
      .filter(
        player => {
          let playerDateOfBirth = new Date(player.dateOfBirth);
          
          return playerDateOfBirth.getTime() === dateOfBirth.getTime();
        })
      
    this.matchedPlayers.sort(
      (player1: IPlayer, player2: IPlayer) => {
        let returnValue: number = 1;

        if (player1.surname < player2.surname) {
          returnValue = -1;
        }
        else if (player1.surname === player2.surname) {
          returnValue = 0;
        }
        
        return returnValue;
      });

    this.playerDetails = (<IPlayer>{});

    if (this.matchedPlayers.length > 0) {
      this.processEvent(FormEvent.PlayersFound)
    }
    else {
      this.processEvent(FormEvent.NoPlayersFound)
    }
  }

  onClickRow(playerId: string) {
    this.playerDetails = this.matchedPlayers
      .filter(
        player => {
          return player._id === playerId;
        })[0];

    this.processEvent(FormEvent.PlayerSelected);
  }

  onReset() {
    this.processEvent(FormEvent.ResetPage);

    window.scrollTo(0, 0);
  }

  onSubmit(formValues: any) {
    this.readPlayerDetailsFields(formValues);

    if (this.playerDetails._id) {
      this.playersService.updatePlayer(this.playerDetails, APP_SETTINGS.currentYear, this.groupYear)
        .subscribe({
          next: response => {
            this.playerDetails.__v = response.body.player.__v;

            this.processEvent(FormEvent.PlayerSaved);

            window.scrollTo(0, 0);
          },
          // Need this handler otherwise the Angular error handling mechanism will kick in.
          error: error => {
          }
        });
    }
    else {
      let dobPicker = formValues.dateOfBirthPicker.datePickerTextBox,
          localeDateOfBirth = new Date(dobPicker.year, dobPicker.month - 1, dobPicker.day),
          dateOfBirth = moment.utc(localeDateOfBirth).add(0 - localeDateOfBirth.getTimezoneOffset(), "m");

      this.playerDetails.dateOfBirth = dateOfBirth.toISOString();

      this.playersService.createPlayer(this.playerDetails, APP_SETTINGS.currentYear, this.groupYear)
        .subscribe({
          next: response => {
            this.groupPlayers.push(response.body.player);

            this.processEvent(FormEvent.PlayerSaved);

            window.scrollTo(0, 0);
          },
          // Need this handler otherwise the Angular error handling mechanism will kick in.
          error: error => {
          }
        });
    }

    this.processEvent(FormEvent.SavingPlayer);
  }

  private processEvent(event: FormEvent): void {
    let dateOfBirthPicker: AbstractControl = null,
        lastRegisteredDatePicker: AbstractControl = null,
        currentDate: Date = null;

    switch (event) {
      case FormEvent.YearChanged:
        this.managePlayersForm.controls['firstName'].markAsUntouched();
        this.managePlayersForm.controls['surname'].markAsUntouched();
        this.managePlayersForm.controls['addressLine1'].markAsUntouched();

        dateOfBirthPicker = this.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox'),
        lastRegisteredDatePicker = this.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox');

        dateOfBirthPicker.markAsTouched();
        lastRegisteredDatePicker.markAsUntouched();

        dateOfBirthPicker.setValue('yyyy-MM-dd');
        lastRegisteredDatePicker.setValue('yyyy-MM-dd');

        if (this.groupYear === 'Select Year') {
          this.dateOfBirthPickerEnabled = false;
        }
        else {
          this.dateOfBirthPickerEnabled = true;

          this.dateOfBirthPickerMinDate = { year: +this.groupYear, month: 1, day: 1 };
          this.dateOfBirthPickerMaxDate = { year: +this.groupYear, month: 12, day: 31 };

          this.dateOfBirthPickerStartDate = { year: +this.groupYear, month: 6 };
        }

        this.currentState = FormState.SearchForPlayer;

        break;
      case FormEvent.DateOfBirthChanged:
        if (this.currentState !== FormState.SearchForPlayer) {
          lastRegisteredDatePicker = this.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox');
            
          lastRegisteredDatePicker.markAsUntouched();
          lastRegisteredDatePicker.setValue('yyyy-MM-dd')

          this.managePlayersForm.controls['firstName'].markAsUntouched();
          this.managePlayersForm.controls['surname'].markAsUntouched();
          this.managePlayersForm.controls['addressLine1'].markAsUntouched();

          this.playerDetails = <IPlayer>{};

          this.currentState = FormState.SearchForPlayer;
        }
        break;
      case FormEvent.PlayersFound:
      case FormEvent.NoPlayersFound:
      case FormEvent.PlayerSelected:
        currentDate = new Date(Date.now());

        this.managePlayersForm.controls['lastRegisteredDatePicker'].patchValue({
          datePickerTextBox: {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          }
        });

        if (event === FormEvent.NoPlayersFound) {
          this.currentState = FormState.AddPlayer;
        }
        else {
          if (event === FormEvent.PlayerSelected) {
            this.currentState = FormState.EditPlayer;
          }
          else {
            this.currentState = FormState.PlayersListed;
          }
        }
        break;
      case FormEvent.SavingPlayer:
        this.currentState = FormState.SavingPlayer;

        break;
      case FormEvent.PlayerSaved:
        this.currentState = FormState.PlayerSaved;

        break;
      case FormEvent.ResetPage:
        this.managePlayersForm.controls['firstName'].markAsUntouched();
        this.managePlayersForm.controls['surname'].markAsUntouched();
        this.managePlayersForm.controls['addressLine1'].markAsUntouched();
    
        lastRegisteredDatePicker = this.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox');
            
        lastRegisteredDatePicker.markAsUntouched();

        currentDate = new Date(Date.now());

        this.managePlayersForm.controls['lastRegisteredDatePicker'].patchValue({
          datePickerTextBox: {
            day: currentDate.getDate(),
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
          }
        });

        break;
      default:
        break;
    }

    this.enableDisableControls();

    this.updatePlayerDetailsFields();
  }

  private updatePlayerDetailsFields(): void {
    this.managePlayersForm.get('firstName').setValue(this.playerDetails.firstName ? this.playerDetails.firstName : '');
    this.managePlayersForm.get('surname').setValue(this.playerDetails.surname ? this.playerDetails.surname : '');
    this.managePlayersForm.get('addressLine1').setValue(this.playerDetails.addressLine1 ? this.playerDetails.addressLine1 : '');
    this.managePlayersForm.get('addressLine2').setValue(this.playerDetails.addressLine2 ? this.playerDetails.addressLine2 : '');
    this.managePlayersForm.get('addressLine3').setValue(this.playerDetails.addressLine3 ? this.playerDetails.addressLine3 : '');
    this.managePlayersForm.get('school').setValue(this.playerDetails.school ? this.playerDetails.school : '');
    this.managePlayersForm.get('medicalConditions').setValue(this.playerDetails.medicalConditions ? this.playerDetails.medicalConditions : '');
    this.managePlayersForm.get('contactName').setValue(this.playerDetails.contactName ? this.playerDetails.contactName : '');
    this.managePlayersForm.get('contactEmailAddress').setValue(this.playerDetails.contactEmailAddress ? this.playerDetails.contactEmailAddress : '');
    this.managePlayersForm.get('contactMobileNumber').setValue(this.playerDetails.contactMobileNumber ? this.playerDetails.contactMobileNumber : '');
    this.managePlayersForm.get('contactHomeNumber').setValue(this.playerDetails.contactHomeNumber ? this.playerDetails.contactHomeNumber : '');
  }

  private readPlayerDetailsFields(formValues: any): void {
    let lrdPicker = formValues.lastRegisteredDatePicker.datePickerTextBox,
        localeLastRegisteredDate = new Date(lrdPicker.year, lrdPicker.month - 1, lrdPicker.day),
        lastRegisteredDate = moment.utc(localeLastRegisteredDate).add(0 - localeLastRegisteredDate.getTimezoneOffset(), "m");

    this.playerDetails.lastRegisteredDate = lastRegisteredDate.toISOString();
    this.playerDetails.lastRegisteredYear = lrdPicker.year;

    if (this.currentState === FormState.AddPlayer || this.currentState === FormState.PlayersListed) {
      this.playerDetails.firstName = formValues.firstName;
      this.playerDetails.surname = formValues.surname;
    }
    this.playerDetails.addressLine1 = formValues.addressLine1;
    this.playerDetails.addressLine2 = formValues.addressLine2;
    this.playerDetails.addressLine3 = formValues.addressLine3;
    this.playerDetails.school = formValues.school;
    this.playerDetails.medicalConditions = formValues.medicalConditions;
    this.playerDetails.contactName = formValues.contactName;
    this.playerDetails.contactEmailAddress = formValues.contactEmailAddress;
    this.playerDetails.contactMobileNumber = formValues.contactMobileNumber;
    this.playerDetails.contactHomeNumber = formValues.contactHomeNumber;
  }

  private enableDisableControls(): void {
    switch (this.currentState) {
      case FormState.SearchForPlayer:
      case FormState.SavingPlayer:
        this.lastRegisteredDatePickerEnabled = false;
        this.managePlayersForm.controls['firstName'].disable();
        this.managePlayersForm.controls['surname'].disable();
        this.managePlayersForm.controls['addressLine1'].disable();
        this.managePlayersForm.controls['addressLine2'].disable();
        this.managePlayersForm.controls['addressLine3'].disable();
        this.managePlayersForm.controls['school'].disable();
        this.managePlayersForm.controls['medicalConditions'].disable();
        this.managePlayersForm.controls['contactName'].disable();
        this.managePlayersForm.controls['contactEmailAddress'].disable();
        this.managePlayersForm.controls['contactMobileNumber'].disable();
        this.managePlayersForm.controls['contactHomeNumber'].disable();

        break;
      case FormState.PlayersListed:
      case FormState.AddPlayer:
      case FormState.EditPlayer:
        this.lastRegisteredDatePickerEnabled = true;
        if (this.currentState === FormState.EditPlayer) {
          this.managePlayersForm.controls['firstName'].disable();
          this.managePlayersForm.controls['surname'].disable();
        }
        else {
          this.managePlayersForm.controls['firstName'].enable();
          this.managePlayersForm.controls['surname'].enable();
        }
        this.managePlayersForm.controls['addressLine1'].enable();
        this.managePlayersForm.controls['addressLine2'].enable();
        this.managePlayersForm.controls['addressLine3'].enable();
        this.managePlayersForm.controls['school'].enable();
        this.managePlayersForm.controls['medicalConditions'].enable();
        this.managePlayersForm.controls['contactName'].enable();
        this.managePlayersForm.controls['contactEmailAddress'].enable();
        this.managePlayersForm.controls['contactMobileNumber'].enable();
        this.managePlayersForm.controls['contactHomeNumber'].enable();

        break;
      default:
        break;
    }
  }
}

enum FormState {
  SearchForPlayer,
  PlayersListed,
  AddPlayer,
  EditPlayer,
  SavingPlayer,
  PlayerSaved
}

enum FormEvent {
  YearChanged,
  DateOfBirthChanged,
  NoPlayersFound,
  PlayersFound,
  PlayerSelected,
  SavingPlayer,
  PlayerSaved,
  ResetPage
}