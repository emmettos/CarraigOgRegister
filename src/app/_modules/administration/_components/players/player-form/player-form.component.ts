import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { NgbActiveModal, NgbDatepicker, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { APP_SETTINGS } from '../../../../../_helpers';
import { IPlayer, IGroup, IGroupPlayer, PlayerState } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services/index';
import { ValidationService } from '../../../../shared/_services/index';


@Component({
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit, AfterViewInit {
  @Input()
  playerDetails: IPlayer;

  @Input()
  groupPlayerDetails: IGroupPlayer;

  @Input()
  dateOfBirth: moment.Moment;

  @Input()
  groups: IGroup[];

  @Input()
  playerState: PlayerState;

  playerForm: FormGroup;

  @ViewChild('registeredDatePicker') 
  registeredDatePicker: NgbDatepicker;

  editingPlayer: boolean = false;
  title = 'Add New Player';

  registeredDateControl: FormControl = null;
  playerGroupControl: FormControl = null;

  savingPlayer: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private playersService: PlayersService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    if (this.playerDetails) {
      this.editingPlayer = true;
      this.title = 'Edit Player - ' + this.playerDetails.firstName + ' ' + this.playerDetails.surname;
    }

    if (this.playerDetails) {
      this.registeredDateControl = new FormControl('');

      if (this.groupPlayerDetails) {
        this.playerGroupControl = new FormControl(this.groups.find(group => group.id === this.groupPlayerDetails.groupId).id);
      }
      else {
        // This is initialized using a string intentionally. 
        this.playerGroupControl = new FormControl('0');
      }
    }
    else {
      // The NgbInputDatepicker directive also validates for required but sets the same validator name
      //  (ngbDate) for both an invalid date and an empty date. Adding the validators.required overrides 
      //  the validator name, for an empty date, of 'ngbDate' date to be 'required'.
      this.registeredDateControl = new FormControl('', Validators.required);
      this.playerGroupControl = new FormControl('0', this.validationService.groupValidator);
    }

    this.playerForm = this.formBuilder.group({
      'firstName': [this.playerDetails ? this.playerDetails.firstName : '', Validators.required],
      'surname': [this.playerDetails ? this.playerDetails.surname : '', Validators.required],
      'addressLine1': [this.playerDetails ? this.playerDetails.addressLine1 : ''],
      'addressLine2': [this.playerDetails ? this.playerDetails.addressLine2 : ''],
      'addressLine3': [this.playerDetails ? this.playerDetails.addressLine3 : ''],
      'dateOfBirth': ['', Validators.required],
      'registeredDate': this.registeredDateControl,
      'playerGroup': this.playerGroupControl,
      'school': [this.playerDetails ? this.playerDetails.school : ''],
      'medicalConditions': [this.playerDetails ? this.playerDetails.medicalConditions : ''],
      'contactName': [this.playerDetails ? this.playerDetails.contactName : ''],
      'contactEmailAddress': [this.playerDetails ? this.playerDetails.contactEmailAddress : ''],
      'contactMobileNumber': [this.playerDetails ? this.playerDetails.contactMobileNumber : ''],
      'contactHomeNumber': [this.playerDetails ? this.playerDetails.contactHomeNumber : '']
    });

    if (this.playerDetails) {
      let dateOfBirth = moment.utc(this.playerDetails.dateOfBirth)

      this.playerForm.controls['dateOfBirth'].setValue({
        day: +dateOfBirth.format('D'),
        month: +dateOfBirth.format('M'),
        year: +dateOfBirth.format('YYYY')
      });
    }
    else {
      this.playerForm.controls['dateOfBirth'].setValue({
        day: +this.dateOfBirth.format('D'),
        month: +this.dateOfBirth.format('M'),
        year: +this.dateOfBirth.format('YYYY')
      }); 
    }

    if (this.groupPlayerDetails) {
      let registeredDate = moment.utc(this.groupPlayerDetails.registeredDate)

      this.registeredDateControl.setValue({
        day: +registeredDate.format('D'),
        month: +registeredDate.format('M'),
        year: +registeredDate.format('YYYY')
      }); 
    }
  }

  ngAfterViewInit() {
    this.registeredDatePicker.minDate = { year: APP_SETTINGS.currentYear - 1, month: 1, day: 1 };
    this.registeredDatePicker.maxDate = { year: APP_SETTINGS.currentYear + 1, month: 12, day: 31 };  

    if (this.playerDetails) {
      this.registeredDateControl.setValidators(this.validationService.registeredDateValidator(this.playerGroupControl));

      this.registeredDateControl['minDate'] = new Date(APP_SETTINGS.currentYear - 1, 0, 1);
      this.registeredDateControl['maxDate'] = new Date(APP_SETTINGS.currentYear + 1, 11, 31);  
    }

    if (!this.groupPlayerDetails) {
      this.registeredDatePicker.startDate = { year: APP_SETTINGS.currentYear, month: 6 };

      // For some reason, without this code, the registeredDate control doesn't pickup the new validator.
      setTimeout(() => {
        this.playerForm.controls['registeredDate'].setValue(null);
      });
    }
  }

  onRegisteredDateChange() {
    this.processRegisteredDateChange();
  }

  onRegisteredDatePickerChange(date: NgbDate) {
    this.processRegisteredDateChange();
  }

  onGroupChange(value: any) {
    if (!this.playerDetails) {
      return;
    }

    if (value === '0') {
      this.registeredDateControl.setValue(null);

      this.registeredDatePicker.startDate = { year: APP_SETTINGS.currentYear, month: 6 };

      this.playerGroupControl.clearValidators();
      this.playerGroupControl.updateValueAndValidity();
    }
    else {
      this.registeredDateControl.markAsTouched();
      this.registeredDateControl.updateValueAndValidity();
    }
  }

  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readPlayerDetailsFields(formValues);

    if (this.playerDetails.id) {
      this.playersService.updatePlayer(this.playerDetails, this.groupPlayerDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.playerDetails = this.playerDetails;
            returnObject.matchedPlayers = response.body.players;

            this.activeModal.close(returnObject);
          },
          error: error => {
            this.activeModal.dismiss();
          }
        });
    }
    else {
      this.playersService.createPlayer(this.playerDetails, this.groupPlayerDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.playerDetails = this.playerDetails;
            returnObject.matchedPlayers = response.body.players;

            this.activeModal.close(returnObject);
          },
          error: error => {
            this.activeModal.dismiss();
          }
        });
    }

    this.savingPlayer = true;

    this.disableControls();
  }

  private processRegisteredDateChange(): void {
    if (!this.playerDetails) {
      return;
    }
    
    if (this.registeredDateControl.value === null) {
      this.playerGroupControl.setValue('0');

      if (this.groupPlayerDetails) {
        this.registeredDatePicker.startDate = { year: APP_SETTINGS.currentYear, month: 6 };
      }
    }

    if (this.registeredDateControl.valid && this.registeredDateControl.value !== null) {
      this.playerGroupControl.setValidators(this.validationService.groupValidator);
    }
    else {
      this.playerGroupControl.clearValidators();
    }

    this.registeredDateControl.updateValueAndValidity();

    this.playerGroupControl.markAsTouched();
    this.playerGroupControl.updateValueAndValidity();
  }

  private readPlayerDetailsFields(formValues: any): void {
    if (!this.playerDetails) {
      this.playerDetails = (<IPlayer>{});
    }

    this.playerDetails.firstName = formValues.firstName;
    this.playerDetails.surname = formValues.surname;
    this.playerDetails.addressLine1 = formValues.addressLine1;
    this.playerDetails.addressLine2 = formValues.addressLine2;
    this.playerDetails.addressLine3 = formValues.addressLine3;
    
    let dobPicker = formValues.dateOfBirth,
        localeDateOfBirth = new Date(dobPicker.year, dobPicker.month - 1, dobPicker.day),
        dateOfBirth = moment.utc(localeDateOfBirth).add(0 - localeDateOfBirth.getTimezoneOffset(), "m");
    this.playerDetails.dateOfBirth = dateOfBirth.format("YYYY-MM-DD")

    this.playerDetails.school = formValues.school;
    this.playerDetails.medicalConditions = formValues.medicalConditions;
    this.playerDetails.contactName = formValues.contactName;
    this.playerDetails.contactEmailAddress = formValues.contactEmailAddress;
    this.playerDetails.contactMobileNumber = formValues.contactMobileNumber;
    this.playerDetails.contactHomeNumber = formValues.contactHomeNumber;

    if (formValues.playerGroup === '0') {
      if (this.groupPlayerDetails) {
        this.groupPlayerDetails.groupId = -1;
      }
    }
    else {
      if (!this.groupPlayerDetails) {
        this.groupPlayerDetails = (<IGroupPlayer>{});

        if (this.playerDetails.id) {
          this.groupPlayerDetails.playerId = this.playerDetails.id;
        }
      }

      let rdPicker = formValues.registeredDate,
          localeRegisteredDate = new Date(rdPicker.year, rdPicker.month - 1, rdPicker.day),
          registeredDate = moment.utc(localeRegisteredDate).add(0 - localeRegisteredDate.getTimezoneOffset(), "m");      
      this.groupPlayerDetails.registeredDate = registeredDate.format("YYYY-MM-DD");
      
      this.groupPlayerDetails.groupId = formValues.playerGroup;
    }
  }

  private disableControls(): void {
    this.playerForm.controls['firstName'].disable();
    this.playerForm.controls['surname'].disable();
    this.playerForm.controls['addressLine1'].disable();
    this.playerForm.controls['addressLine2'].disable();
    this.playerForm.controls['addressLine3'].disable();
    this.playerForm.controls['dateOfBirth'].disable();
    this.registeredDateControl.disable();
    this.playerGroupControl.disable();
    this.playerForm.controls['school'].disable();
    this.playerForm.controls['medicalConditions'].disable();
    this.playerForm.controls['contactName'].disable();
    this.playerForm.controls['contactEmailAddress'].disable();
    this.playerForm.controls['contactMobileNumber'].disable();
    this.playerForm.controls['contactHomeNumber'].disable();
  }

  playerFormHeaderCSSClass() {
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
}
