import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import { IGroup, ICoach } from '../../../../../_models/index';
import { GroupsService, CoachesService } from '../../../../../_services/index';
import { GroupFormComponent } from '../group-form/group-form.component';
import { GroupPopupComponent } from '../group-popup/group-popup.component';


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

  groups: IGroup[] = null;
  filteredGroups: IGroup[] = null;

  totalCount: number = 0;

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
      'coachFilter': ['']
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
    
          this.groupsService.readGroups()
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

  onClickRow(group: IGroup) {
    let modalRef = this.modalService.open(GroupPopupComponent);

    modalRef.componentInstance.groupDetails = group;
  }

  onClickEditGroup(event: Event, group: IGroup) {
    const modalRef: NgbModalRef = this.modalService.open(GroupFormComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.groupDetails = group;
    modalRef.componentInstance.coaches = this.coaches;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Group Successfully Updated', returnObject.groupDetails.name);

          this.processReturnedGroups(returnObject.updatedGroups);
        }
      })
      .catch(error => {
        this.toasterService.pop('error', 'Failed Updating Group', error.groupDetails.name);
      });
    
    event.stopPropagation();
  }

  onClickDownloadCSV() {
    // let csvGroups: any[] = [];

    // this.filteredGroups.forEach(coach => {
    //   let csvGroup: any = {};
      
    //   csvCoach.emailAddress = coach.emailAddress;
    //   csvCoach.surname = coach.surname;
    //   csvCoach.firstName = coach.firstName;
    //   csvCoach.phoneNumber = coach.phoneNumber;
    //   csvCoach.administrator = coach.isAdministrator ? 'YES' : 'NO';

    //   csvGroups.push(csvCoach);
    // });

    // this.groupsService.downloadCSV(csvGroups);
  }

  // This is public for the unit tests.
  filterGroups(formValues: any) {
    this.filteredGroups = this.groups
      .filter(group => {
        let coachFilter = formValues.coachFilter;

        if (coachFilter === null) {
          coachFilter = '';
        }

        if ((group.footballCoach.toLowerCase().indexOf(coachFilter.toLowerCase()) !== -1 ||
            group.hurlingCoach.toLowerCase().indexOf(coachFilter.toLowerCase()) !== -1)) {
          return true;
        }
      });
    
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

  private processReturnedGroups(groups: IGroup[]) {
    this.groups = groups;

    this.totalCount = this.groups.length;

    this.groups.forEach(group => {
      group.footballCoachFullName = this.lookupCoachFullName(group.footballCoach);
      group.hurlingCoachFullName = this.lookupCoachFullName(group.hurlingCoach);
    });

    this.filteredGroups = this.groups.slice(0);

    this.onClickHeader(this.sortKey, false);
  }

  private lookupCoachFullName(emailAddress: string): string {
    let first = 0,
        last = this.coaches.length - 1;

    while (first <= last) {
      let middle = Math.floor((first + last) / 2)

      if (this.coaches[middle].emailAddress < emailAddress) {
        first = middle + 1;
      }
      else if (this.coaches[middle].emailAddress > emailAddress) {
        last = middle - 1;
      }
      else {
        return this.coaches[middle].firstName + ' ' + this.coaches[middle].surname;
      }
    }

    return emailAddress;
  }
}
