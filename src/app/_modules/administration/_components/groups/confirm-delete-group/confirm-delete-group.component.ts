import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroupSummary } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services/index';


@Component({
  templateUrl: './confirm-delete-group.component.html',
  styleUrls: ['./confirm-delete-group.component.css']
})
export class ConfirmDeleteGroupComponent implements OnInit {
  @Input()
  groupSummary: IGroupSummary;

  deleteGroupForm: FormGroup;

  deletingGroup: Boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private groupsService: GroupsService) {
  }

  ngOnInit() {
    this.deleteGroupForm = this.formBuilder.group({});
  }

  onClickCancel() {
    this.activeModal.close();
  }

  onSubmit(formValues: any) {
    this.groupsService.deleteGroup(this.groupSummary)
      .subscribe({
        next: response => {
          let returnObject: any = {}

          returnObject.updatedGroups = response.body.groups;

          this.activeModal.close(returnObject);
        },
        error: error => {
          this.activeModal.dismiss();
        }
      });

    this.deletingGroup = true;
  }
}
