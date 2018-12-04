import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../../../../../_models/index';
import { CoachesService } from '../../../../../_services/index';


@Component({
  templateUrl: './confirm-delete-coach.component.html',
  styleUrls: ['./confirm-delete-coach.component.css']
})
export class ConfirmDeleteCoachComponent implements OnInit {
  @Input()
  coachDetails: ICoach;

  deleteCoachForm: FormGroup;

  deletingCoach: Boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private coachesService: CoachesService) {
  }

  ngOnInit() {
    this.deleteCoachForm = this.formBuilder.group({
      'sendGoodbyeEmail': [false],
    });
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.coachesService.deleteCoach(this.coachDetails, formValues.sendGoodbyeEmail)
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
          errorObject.error = error.message;
          
          this.activeModal.dismiss(errorObject);
        }
      });

    this.deletingCoach = true;

    this.deleteCoachForm.controls['sendGoodbyeEmail'].disable();
  }
}
