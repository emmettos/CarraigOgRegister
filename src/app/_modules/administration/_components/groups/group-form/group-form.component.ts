import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../../_helpers';
import { IGroup, ICoach } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services/index';
import { ValidationService } from '../../../../shared/_services';


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

  yearsOfBirth: number[];

  editingGroup: boolean = false;
  title = 'Add New Group';

  savingGroup: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private groupsService: GroupsService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this.yearsOfBirth = APP_SETTINGS.yearsOfBirth;

    if (this.groupDetails) {
      this.editingGroup = true;
      this.title = 'Edit Group - ' + this.groupDetails.name;
    }

    this.groupForm = this.formBuilder.group({
      'name': [this.groupDetails ? this.groupDetails.name : '', Validators.required],
      'yearOfBirth': [this.groupDetails ? this.groupDetails.yearOfBirth : '0', this.validationService.yearOfBirthValidator],
      'footballCoach': [this.groupDetails ? this.groupDetails.footballCoachId ? this.groupDetails.footballCoachId : '0' : '0'],
      'hurlingCoach': [this.groupDetails ? this.groupDetails.hurlingCoachId ? this.groupDetails.hurlingCoachId : '0' : '0']
    });
  }
 
  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.readGroupDetailsFields(formValues);

    if (this.groupDetails.id) {
      this.groupsService.updateGroup(this.groupDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}
  
            returnObject.groupDetails = this.groupDetails;
            returnObject.updatedGroups = response.body.groups;
  
            this.activeModal.close(returnObject);
          },
          error: error => {
            this.activeModal.dismiss();
          }
        });    
    }
    else {
      this.groupsService.createGroup(this.groupDetails)
        .subscribe({
          next: response => {
            let returnObject: any = {}

            returnObject.groupDetails = this.groupDetails;
            returnObject.updatedGroups = response.body.groups;

            this.activeModal.close(returnObject);
          },
          error: error => {
            this.activeModal.dismiss();
          }
        });
    }
  
    this.savingGroup = true;

    this.disableControls();
  }

  private readGroupDetailsFields(formValues: any): void {
    if (!this.groupDetails) {
      this.groupDetails = (<IGroup>{});
    }

    this.groupDetails.yearOfBirth = formValues.yearOfBirth;
    this.groupDetails.name = formValues.name;
    if (formValues.footballCoach === '0') {
      this.groupDetails.footballCoachId = null;
    }
    else {
      this.groupDetails.footballCoachId = formValues.footballCoach;
    }
    if (formValues.hurlingCoach === '0') {
      this.groupDetails.hurlingCoachId = null;
    }
    else {      
      this.groupDetails.hurlingCoachId = formValues.hurlingCoach;
    }
  }

  private disableControls(): void {
    this.groupForm.controls['yearOfBirth'].disable();
    this.groupForm.controls['name'].disable();
    this.groupForm.controls['footballCoach'].disable();
    this.groupForm.controls['hurlingCoach'].disable();
  }

  groupFormHeaderCSSClass() {
    var CSSClass = 'bg-info';

    if (!this.groupDetails) {
        CSSClass = 'bg-success';
    }

    return CSSClass;
  }
}
