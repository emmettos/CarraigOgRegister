import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../../../../_models/index';
import { CoachesService } from '../../../../_services/index';
import { ValidationService } from '../../../shared/_services/index';


@Component({
  templateUrl: './coach-form.component.html',
  styleUrls: ['./coach-form.component.css']
})
export class CoachFormComponent implements OnInit {
  @Input()
  coachDetails: ICoach;

  coachForm: FormGroup;

  editingCoach: Boolean = false;
  title = 'Add New Coach';

  savingCoach: Boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private coachesService: CoachesService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this.coachForm = this.formBuilder.group({
      'emailAddress': [{ value: this.coachDetails ? this.coachDetails.emailAddress : '', disabled: this.coachDetails }, Validators.compose([Validators.required, this.validationService.emailValidator])],
      'firstName': [this.coachDetails ? this.coachDetails.firstName : '', Validators.required],
      'surname': [this.coachDetails ? this.coachDetails.surname : '', Validators.required],
      'phoneNumber': [this.coachDetails ? this.coachDetails.phoneNumber : ''],
      'isAdministrator': [this.coachDetails ? this.coachDetails.isAdministrator : false],
    });

    if (this.coachDetails) {
      this.editingCoach = true;
      this.title = 'Edit Coach - ' + this.coachDetails.emailAddress;

      this.coachForm.controls['emailAddress'].disable();
    }
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readCoachDetailsFields(formValues);

    if (this.coachDetails._id) {
      this.coachesService.updateCoach(this.coachDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.coachDetails = this.coachDetails;
            returnObject.updatedCoaches = response.body.coaches;

            this.activeModal.close(returnObject);
          },
          error: error => {
            let errorObject: any = {}

            errorObject.coachDetails = this.coachDetails;
            errorObject.error = error;
            
            this.activeModal.dismiss(errorObject);
          }
        });
    }
    else {
      this.coachesService.createCoach(this.coachDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.coachDetails = this.coachDetails;
            returnObject.updatedCoaches = response.body.coaches;

            this.activeModal.close(returnObject);
          },
          error: error => {
            let errorObject: any = {}

            errorObject.coachDetails = this.coachDetails;
            errorObject.error = error;
            
            this.activeModal.dismiss(errorObject);
          }
        });
    }

    this.savingCoach = true;

    this.disableControls();
  }

  private readCoachDetailsFields(formValues: any): void {
    if (!this.coachDetails) {
      this.coachDetails = (<ICoach>{});

      this.coachDetails.emailAddress = formValues.emailAddress;
    }

    this.coachDetails.firstName = formValues.firstName;
    this.coachDetails.surname = formValues.surname;
    this.coachDetails.phoneNumber = formValues.phoneNumber;
    this.coachDetails.isAdministrator = formValues.isAdministrator;
  }

  private disableControls(): void {
    this.coachForm.controls['emailAddress'].disable();
    this.coachForm.controls['firstName'].disable();
    this.coachForm.controls['surname'].disable();
    this.coachForm.controls['phoneNumber'].disable();
    this.coachForm.controls['isAdministrator'].disable();
  }
}
