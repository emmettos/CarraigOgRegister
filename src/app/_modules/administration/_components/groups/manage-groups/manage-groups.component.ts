import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import { IGroup } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services/index';
// import { CoachFormComponent } from '../coach-form/coach-form.component';
// import { CoachPopupComponent } from '../coach-popup/coach-popup.component';


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

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private groupsService: GroupsService) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      'managerFilter': ['']
    });

    this.filterForm.valueChanges
      .subscribe(formValues => { 
        this.filterGroups(formValues)
      });

    this.groupsService.readGroups()
      .subscribe({
        next: response => {
          this.groups = response.body.groups;

          this.filteredGroups = this.groups.slice(0);

          this.onClickHeader(this.sortKey, false);      
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
    // let modalRef = this.modalService.open(GroupPopupComponent);

    // modalRef.componentInstance.groupDetails = group;  
  }

  onClickEditGroup(event: Event, coach: IGroup) {
    // const modalRef: NgbModalRef = this.modalService.open(GroupFormComponent, { size: 'lg', backdrop: 'static' });

    // modalRef.componentInstance.groupDetails = group;

    // modalRef.result
    //   .then(returnObject => {
    //     if (returnObject) {
    //       this.toasterService.pop('success', 'Group Successfully Updated', returnObject.groupDetails.name);

    //       this.processReturnedCoaches(returnObject.updatedCoaches);
    //     }
    //   })
    //   .catch(error => {
    //     this.toasterService.pop('error', 'Failed Updating Group', error.groupDetails.name);
    //   });
    
    // event.stopPropagation();
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
        let managerFilter = formValues.managerFilter;

        if (managerFilter === null) {
          managerFilter = '';
        }

        if ((group.footballManager.toLowerCase().indexOf(managerFilter.toLowerCase()) !== -1 ||
            group.hurlingManager.toLowerCase().indexOf(managerFilter.toLowerCase()) !== -1)) {
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
}
