import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { IPlayer, IGroup, IGroupPlayer } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services/index';
import { ValidationService } from '../../../../shared/_services/index';


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

  lastRegisteredDatePickerLabel: string;
  dateOfBirthPickerLabel: string;

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
      'addressLine1': [this.playerDetails ? this.playerDetails.addressLine1 : '', Validators.required],
      'addressLine2': [this.playerDetails ? this.playerDetails.addressLine2 : '', Validators.required],
      'addressLine3': [this.playerDetails ? this.playerDetails.addressLine3 : '', Validators.required],
      'dateOfBirthPicker': this.formBuilder.group({}),
      'lastRegisteredDatePicker': this.formBuilder.group({}),
      'playerGroup': [this.groupPlayerDetails ? this.groups.find(group => group.id === this.groupPlayerDetails.groupId).id : 'Select Group', this.validationService.groupValidator],
      'school': [this.playerDetails ? this.playerDetails.school : '', Validators.required],
      'medicalConditions': [this.playerDetails ? this.playerDetails.medicalConditions : '', Validators.required],
      'contactName': [this.playerDetails ? this.playerDetails.contactName : '', Validators.required],
      'contactEmailAddress': [this.playerDetails ? this.playerDetails.contactEmailAddress : '', Validators.required],
      'contactMobileNumber': [this.playerDetails ? this.playerDetails.contactMobileNumber : '', Validators.required],
      'contactHomeNumber': [this.playerDetails ? this.playerDetails.contactHomeNumber : '', Validators.required]
    });

    this.lastRegisteredDatePickerLabel = 'Registered Date';
    this.dateOfBirthPickerLabel = 'Date Of Birth';

    setTimeout(() => {
      if (this.groupPlayerDetails) {
        let registeredDate = moment.utc(this.groupPlayerDetails.registeredDate)

        this.playerForm.controls['lastRegisteredDatePicker'].patchValue({
          datePickerTextBox: {
            day: +registeredDate.format('D'),
            month: +registeredDate.format('M'),
            year: +registeredDate.format('YYYY')
          }
        });
      }

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
    this.playerDetails.school = formValues.school;
    this.playerDetails.medicalConditions = formValues.medicalConditions;
    this.playerDetails.contactName = formValues.contactName;
    this.playerDetails.contactEmailAddress = formValues.contactEmailAddress;
    this.playerDetails.contactMobileNumber = formValues.contactMobileNumber;
    this.playerDetails.contactHomeNumber = formValues.contactHomeNumber;
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
