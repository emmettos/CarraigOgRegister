import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import * as moment from 'moment';

import { ICoach, IGroupSummary } from '../../../../../_models/index';
import { GroupsService, CoachesService } from '../../../../../_services/index';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupPopupComponent } from '../group-popup/group-popup.component';
import { ConfirmDeleteGroupComponent } from '../confirm-delete-group/confirm-delete-group.component';


@Component({
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent implements OnInit {
  filterForm: FormGroup;

  @ViewChild('nameFilter') 
  nameFilterElementRef: ElementRef;

  sortKey: string = "yearOfBirth";
  reverse: boolean = false;

  groups: IGroupSummary[] = null;
  filteredGroups: IGroupSummary[] = null;

  totalCount: number = 0;

  deletableGroups: boolean = false;

  coaches: ICoach[] = null;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private groupsService: GroupsService,
    private coachesService: CoachesService) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      'nameFilter': ['']
    });

    this.filterForm.valueChanges
      .subscribe(formValues => { 
        this.filterGroups(formValues)
      });

    this.coachesService.readCoaches()
      .subscribe({
        next: response => {
          this.coaches = response.body.coaches
            .sort((coach1: ICoach, coach2: ICoach) => {
              let returnValue: number = 1;
      
              if (coach1.emailAddress < coach2.emailAddress) {
                returnValue = -1;
              }
              else if (coach1.emailAddress === coach2.emailAddress) {
                returnValue = 0;
              }
              
              return returnValue;
            });
    
          this.groupsService.readGroupSummaries()
            .subscribe({
              next: response => {
                this.processReturnedGroups(response.body.groups);
              },
              // Need this handler otherwise the Angular error handling mechanism will kick in.
              error: error => {
              }
            });
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }

  onClickHeader(newSortKey: string, flipSort: boolean = true) {
    if (this.sortKey === newSortKey) {
      if (flipSort) {
        this.reverse = !this.reverse;
      }
    }
    else {
      this.sortKey = newSortKey;
      this.reverse = false;
    }
    
    this.filteredGroups
      .sort((group1: any, group2: any) => {
        let returnValue: number = 1;

        if (group1[this.sortKey] < group2[this.sortKey]) {
          returnValue = -1;
        }
        else if (group1[this.sortKey] === group2[this.sortKey]) {
          returnValue = 0;
        }

        if (this.reverse) {
          returnValue = returnValue * -1;
        }
        
        return returnValue;
      });
  }

  onClickAddGroup() {
    const modalRef: NgbModalRef = this.modalService.open(GroupFormComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.coaches = this.coaches;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Group Successfully Added', returnObject.groupDetails.name);

          this.processReturnedGroups(returnObject.updatedGroups);
        }

        this.nameFilterElementRef.nativeElement.focus();
      })
      // Need this handler otherwise the Angular error handling mechanism will kick in.
      .catch(error => {
      });
  }

  onClickEditGroup(event: Event, groupSummary: IGroupSummary) {
    this.groupsService.readGroupDetails(groupSummary.id)
      .subscribe({
        next: response => {
          const modalRef: NgbModalRef = this.modalService.open(GroupFormComponent, { size: 'lg', backdrop: 'static' });

          modalRef.componentInstance.groupDetails = response.body.groupDetails;
          modalRef.componentInstance.coaches = this.coaches;
      
          modalRef.result
            .then(returnObject => {
              if (returnObject) {
                this.toasterService.pop('success', 'Group Successfully Updated', returnObject.groupDetails.name);

                this.processReturnedGroups(returnObject.updatedGroups);
              }
            })
            .catch(error => {
            });
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
    
    event.stopPropagation();
  }

  onClickDeleteGroup(event: Event, groupSummary: IGroupSummary) {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmDeleteGroupComponent, { backdrop: 'static' });

    modalRef.componentInstance.groupSummary = groupSummary;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Group Successfully Deleted', groupSummary.name);

          this.processReturnedGroups(returnObject.updatedGroups);
        }
      })
      // Need this handler otherwise the Angular error handling mechanism will kick in.
      .catch(error => {
      });

    event.stopPropagation();
  }

  onClickRow(groupSummary: IGroupSummary) {
    this.groupsService.readGroupDetails(groupSummary.id)
      .subscribe({
        next: response => {
          let modalRef: NgbModalRef = this.modalService.open(GroupPopupComponent);

          modalRef.componentInstance.groupDetails = response.body.groupDetails;

          modalRef.componentInstance.footballCoachFullName = groupSummary.footballCoachFullName;
          modalRef.componentInstance.hurlingCoachFullName = groupSummary.hurlingCoachFullName;
          modalRef.componentInstance.numberOfPlayers = groupSummary.numberOfPlayers;
          
          modalRef.componentInstance.lastUpdatedDate = groupSummary.lastUpdatedDate;
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }

  onClickDownloadCSV() {
    let csvGroups: any[] = [];

    this.filteredGroups.forEach(group => {
      let csvGroup: any = {};
      
      csvGroup.name = group.name;
      csvGroup.yearOfBirth = group.yearOfBirth;
      csvGroup.footballCoach = group.footballCoachFullName;
      csvGroup.hurlingCoach = group.hurlingCoachFullName;
      csvGroup.numberOfPlayers = group.numberOfPlayers;
      csvGroup.lastUpdatedDate = moment.utc(group.lastUpdatedDate).format("YYYY-MM-DD");

      csvGroups.push(csvGroup);
    });

    this.groupsService.downloadCSV(csvGroups);
  }

  // This is public for the unit tests.
  filterGroups(formValues: any) {
    this.filteredGroups = this.groups
      .filter(group => {
        let nameFilter = formValues.nameFilter;

        if (nameFilter === null) {
          nameFilter = '';
        }

        if (group.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) {
          return true;
        }
      });
    
    this.onClickHeader(this.sortKey, false);
  }

  private processReturnedGroups(groups: IGroupSummary[]) {
    this.groups = groups;

    this.totalCount = this.groups.length;

    this.deletableGroups = false;

    this.groups.forEach(group => {
      if (group.numberOfPlayers === 0) {
        this.deletableGroups = true;
      }
    });

    this.filteredGroups = this.groups.slice(0);

    this.onClickHeader(this.sortKey, false);
  }

  headerSortCSSClass(keyName) {
    var CSSClass = "fa fa-sort";

    if (this.sortKey === keyName) {
      if (this.reverse) {
        CSSClass = "fa fa-sort-desc";
      }
      else {
        CSSClass = "fa fa-sort-asc";
      }
    }

    return CSSClass;
  };
}
