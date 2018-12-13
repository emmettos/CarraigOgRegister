import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroup, ICoach } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services/index';


@Component({
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {
  @Input()
  groupDetails: IGroup;

  @Input()
  coaches: ICoach[];

  groupForm: FormGroup;

  savingGroup: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private groupsService: GroupsService) {
  }

  ngOnInit() {
    let footballCoach = this.coaches.find(coach => {
      return coach.emailAddress === this.groupDetails.footballCoach;
    });
    let hurlingCoach = this.coaches.find(coach => {
      return coach.emailAddress === this.groupDetails.hurlingCoach;
    });
 
    this.groupForm = this.formBuilder.group({
      'footballCoach': [footballCoach ? footballCoach.emailAddress : ''],
      'hurlingCoach': [hurlingCoach ? hurlingCoach.emailAddress : '']
    });
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readGroupDetailsFields(formValues);

    this.groupsService.updateGroup(this.groupDetails)
      .subscribe({
        next: response => {
          let returnObject: any = {}

          returnObject.groupDetails = this.groupDetails;
          returnObject.updatedGroups = response.body.groups;

          this.activeModal.close(returnObject);
        },
        error: error => {
          let errorObject: any = {}

          errorObject.groupDetails = this.groupDetails;
          errorObject.error = error.message
          
          this.activeModal.dismiss(errorObject);
        }
      });

    this.savingGroup = true;

    this.disableControls();
  }

  private readGroupDetailsFields(formValues: any): void {
    this.groupDetails.footballCoach = formValues.footballCoach;
    this.groupDetails.hurlingCoach = formValues.hurlingCoach;
  }

  private disableControls(): void {
    this.groupForm.controls['footballCoach'].disable();
    this.groupForm.controls['hurlingCoach'].disable();
  }
}
