import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach, ICoachSummary } from '../../../../../_models/index';
import { CoachesService } from '../../../../../_services/index';
import { ValidationService } from '../../../../shared/_services/index';


@Component({
  templateUrl: './coach-form.component.html',
  styleUrls: ['./coach-form.component.css']
})
export class CoachFormComponent implements OnInit {
  @Input()
  coachDetails: ICoach;

  @Input()
  activeCoach: boolean;

  @Input()
  currentCoaches: ICoachSummary[];

  emailAddressControl: FormControl;
    
  coachForm: FormGroup;

  editingCoach: boolean = false;
  title = 'Add New Coach';

  savingCoach: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private coachesService: CoachesService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    let otherCoaches: ICoachSummary[] = this.currentCoaches;

    if (this.coachDetails) {
      this.editingCoach = true;
      this.title = 'Edit Coach';

      otherCoaches = this.currentCoaches.filter((coach, index, arr) => {
        return coach.emailAddress !== this.coachDetails.emailAddress;
      });
    }

    this.emailAddressControl = new FormControl(this.coachDetails ? this.coachDetails.emailAddress : '', { 
      validators: [Validators.required, this.validationService.emailValidator, this.validationService.newCoachValidator(otherCoaches)],
      updateOn: 'blur'
    });

    this.coachForm = this.formBuilder.group({
      'emailAddress': this.emailAddressControl,
      'firstName': [this.coachDetails ? this.coachDetails.firstName : '', Validators.required],
      'surname': [this.coachDetails ? this.coachDetails.surname : '', Validators.required],
      'phoneNumber': [this.coachDetails ? this.coachDetails.phoneNumber : ''],
      'administrator': [this.coachDetails ? this.coachDetails.administrator : false],
    });
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readCoachDetailsFields(formValues);

    if (this.coachDetails.id) {
      this.coachesService.updateCoach(this.coachDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.coachDetails = this.coachDetails;
            returnObject.updatedCoaches = response.body.coaches;

            this.activeModal.close(returnObject);
          },
          error: error => {
            this.activeModal.dismiss();
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
            this.activeModal.dismiss();
          }
        });
    }

    this.savingCoach = true;

    this.disableControls();
  }

  private readCoachDetailsFields(formValues: any): void {
    if (!this.coachDetails) {
      this.coachDetails = (<ICoach>{});
    }

    this.coachDetails.emailAddress = formValues.emailAddress;
    this.coachDetails.firstName = formValues.firstName;
    this.coachDetails.surname = formValues.surname;
    this.coachDetails.phoneNumber = formValues.phoneNumber;
    this.coachDetails.administrator = formValues.administrator;
  }

  private disableControls(): void {
    this.emailAddressControl.disable();
    this.coachForm.controls['firstName'].disable();
    this.coachForm.controls['surname'].disable();
    this.coachForm.controls['phoneNumber'].disable();
    this.coachForm.controls['administrator'].disable();
  }

  coachFormHeaderCSSClass() {
    var CSSClass = 'bg-info';

    if (this.coachDetails) {
      if (!this.activeCoach) {
        CSSClass = 'bg-warning';
      }
      else {
        CSSClass = 'bg-success';
      }
    }

    return CSSClass;
  }
}
