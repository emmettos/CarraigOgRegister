import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { APP_SETTINGS } from '../../../../../_helpers';
import { IPlayer, IGroup, IGroupPlayer } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services/index';
import { ValidationService } from '../../../../shared/_services/index';
import { NgbPopoverWindow } from '@ng-bootstrap/ng-bootstrap/popover/popover';


@Component({
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {
  @Input()
  playerDetails: IPlayer;

  @Input()
  groupPlayerDetails: IGroupPlayer;

  @Input()
  groups: IGroup[];

  playerForm: FormGroup;

  dateOfBirthPickerLabel: string;

  registeredDatePickerLabel: string;
  registeredDatePickerMinDate: NgbDateStruct;
  registeredDatePickerMaxDate: NgbDateStruct;
  registeredDatePickerStartDate: any;

  editingPlayer: boolean = false;
  title = 'Add New Player';

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

    this.playerForm = this.formBuilder.group({
      'firstName': [this.playerDetails ? this.playerDetails.firstName : '', Validators.required],
      'surname': [this.playerDetails ? this.playerDetails.surname : '', Validators.required],
      'addressLine1': [this.playerDetails ? this.playerDetails.addressLine1 : ''],
      'addressLine2': [this.playerDetails ? this.playerDetails.addressLine2 : ''],
      'addressLine3': [this.playerDetails ? this.playerDetails.addressLine3 : ''],
      'dateOfBirthPicker': this.formBuilder.group({}),
      'registeredDatePicker': this.formBuilder.group({}),
      'playerGroup': [this.groupPlayerDetails ? this.groups.find(group => group.id === this.groupPlayerDetails.groupId).id : 'Not Registered'],
      'school': [this.playerDetails ? this.playerDetails.school : ''],
      'medicalConditions': [this.playerDetails ? this.playerDetails.medicalConditions : ''],
      'contactName': [this.playerDetails ? this.playerDetails.contactName : ''],
      'contactEmailAddress': [this.playerDetails ? this.playerDetails.contactEmailAddress : ''],
      'contactMobileNumber': [this.playerDetails ? this.playerDetails.contactMobileNumber : ''],
      'contactHomeNumber': [this.playerDetails ? this.playerDetails.contactHomeNumber : '']
    });

    this.dateOfBirthPickerLabel = 'Date Of Birth';
    this.registeredDatePickerLabel = 'Registered Date';

    setTimeout(() => {
      if (this.playerDetails) {
        let dateOfBirth = moment.utc(this.playerDetails.dateOfBirth)

        this.playerForm.controls['dateOfBirthPicker'].patchValue({
          datePickerTextBox: {
            day: +dateOfBirth.format('D'),
            month: +dateOfBirth.format('M'),
            year: +dateOfBirth.format('YYYY')
          }
        }); 
      }

      this.registeredDatePickerMinDate = { year: APP_SETTINGS.currentYear - 1, month: 1, day: 1 };
      this.registeredDatePickerMaxDate = { year: APP_SETTINGS.currentYear + 1, month: 12, day: 31 };

      if (APP_SETTINGS.currentYear !== (new Date()).getFullYear()) {
        this.registeredDatePickerStartDate = { year: APP_SETTINGS.currentYear, month: 6 };      
      }

      if (this.groupPlayerDetails) {
        let registeredDate = moment.utc(this.groupPlayerDetails.registeredDate)

        this.playerForm.controls['registeredDatePicker'].patchValue({
          datePickerTextBox: {
            day: +registeredDate.format('D'),
            month: +registeredDate.format('M'),
            year: +registeredDate.format('YYYY')
          }
        });
      }
      else {
        let registeredDatePicker: AbstractControl = this.playerForm.controls['registeredDatePicker'].get('datePickerTextBox');

        registeredDatePicker.setValue('yyyy-MM-dd');
      }
    });
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readPlayerDetailsFields(formValues);

    // if (this.playerDetails.id) {
    //   this.coachesService.updateCoach(this.coachDetails)
    //     .subscribe({
    //       next: response => {
    //         let returnObject: any = {}

    //         returnObject.coachDetails = this.coachDetails;
    //         returnObject.updatedCoaches = response.body.coaches;

    //         this.activeModal.close(returnObject);
    //       },
    //       error: error => {
    //         let errorObject: any = {}

    //         errorObject.coachDetails = this.coachDetails;
    //         errorObject.error = error.message
            
    //         this.activeModal.dismiss(errorObject);
    //       }
    //     });
    // }
    // else {
    //   this.coachesService.createCoach(this.coachDetails)
    //     .subscribe({
    //       next: response => {
    //         let returnObject: any = {}

    //         returnObject.coachDetails = this.coachDetails;
    //         returnObject.updatedCoaches = response.body.coaches;

    //         this.activeModal.close(returnObject);
    //       },
    //       error: error => {
    //         let errorObject: any = {}

    //         errorObject.coachDetails = this.coachDetails;
    //         errorObject.error = error.message;
            
    //         this.activeModal.dismiss(errorObject);
    //       }
    //     });
    // }

    // this.savingCoach = true;

    // this.disableControls();
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
    
    let dobPicker = formValues.lastRegisteredDatePicker.datePickerTextBox,
        localeDateOfBirth = new Date(dobPicker.year, dobPicker.month - 1, dobPicker.day),
        dateOfBirth = moment.utc(localeDateOfBirth).add(0 - localeDateOfBirth.getTimezoneOffset(), "m");
    this.playerDetails.dateOfBirth = dateOfBirth.toISOString();

    this.playerDetails.school = formValues.school;
    this.playerDetails.medicalConditions = formValues.medicalConditions;
    this.playerDetails.contactName = formValues.contactName;
    this.playerDetails.contactEmailAddress = formValues.contactEmailAddress;
    this.playerDetails.contactMobileNumber = formValues.contactMobileNumber;
    this.playerDetails.contactHomeNumber = formValues.contactHomeNumber;

    if (!this.groupPlayerDetails) {
      this.groupPlayerDetails = (<IGroupPlayer>{});
    }

    this.groupPlayerDetails.groupId = formValues.playerGroup;

    let rdPicker = formValues.lastRegisteredDatePicker.datePickerTextBox,
        localeRegisteredDate = new Date(rdPicker.year, rdPicker.month - 1, rdPicker.day),
        registeredDate = moment.utc(localeRegisteredDate).add(0 - localeRegisteredDate.getTimezoneOffset(), "m");
    this.groupPlayerDetails.registeredDate = registeredDate.toISOString();
  }

  private disableControls(): void {
    this.playerForm.controls['firstName'].disable();
    this.playerForm.controls['surname'].disable();
    this.playerForm.controls['addressLine1'].disable();
    this.playerForm.controls['addressLine2'].disable();
    this.playerForm.controls['addressLine3'].disable();
    this.playerForm.controls['school'].disable();
    this.playerForm.controls['medicalConditions'].disable();
    this.playerForm.controls['contactName'].disable();
    this.playerForm.controls['contactEmailAddress'].disable();
    this.playerForm.controls['contactMobileNumber'].disable();
    this.playerForm.controls['contactHomeNumber'].disable();
  }
}
