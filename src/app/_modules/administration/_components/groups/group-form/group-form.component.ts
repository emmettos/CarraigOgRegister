import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../../_helpers';
import { IGroup, IGroupSummary, ICoach } from '../../../../../_models/index';
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
  numberOfPlayers: number;

  @Input()
  coaches: ICoach[];

  @Input()
  currentGroups: IGroupSummary[];

  nameControl: FormControl;

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

    let otherGroups: IGroupSummary[] = this.currentGroups;

    if (this.groupDetails) {
      this.editingGroup = true;
      this.title = 'Edit Group';

      otherGroups = this.currentGroups.filter((group, index, arr) => {
        return group.name !== this.groupDetails.name;
      });
    }

    this.nameControl = new FormControl(this.groupDetails ? this.groupDetails.name : '', { 
      validators: [Validators.required, this.validationService.newGroupValidator(otherGroups)],
      updateOn: 'blur'
    });

    this.groupForm = this.formBuilder.group({
      'name': this.nameControl,
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

    this.groupDetails.name = formValues.name;
    this.groupDetails.yearOfBirth = formValues.yearOfBirth;
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
    this.groupForm.controls['name'].disable();
    this.groupForm.controls['yearOfBirth'].disable();
    this.groupForm.controls['footballCoach'].disable();
    this.groupForm.controls['hurlingCoach'].disable();
  }

  groupFormHeaderCSSClass() {
    var CSSClass = 'bg-info';

    if (this.groupDetails) {
      if (this.numberOfPlayers > 0) {
        CSSClass = 'bg-success';
      }
      else {
        CSSClass = 'bg-warning';
      }
    }

    return CSSClass;
  }
}
