import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import { ICoach, IUserProfile } from '../../../../_models/index';
import { CoachesService, AuthorizationService } from '../../../../_services/index';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { ConfirmDeleteCoachComponent } from '../confirm-delete-coach/confirm-delete-coach.component';


@Component({
  templateUrl: './manage-coaches.component.html',
  styleUrls: ['./manage-coaches.component.css']
})
export class ManageCoachesComponent implements OnInit {
  filterForm: FormGroup;

  @ViewChild('nameFilter') 
  nameFilterElementRef: ElementRef;

  sortKey: string = "surname";
  reverse: boolean = false;

  coaches: ICoach[] = null;
  filteredCoaches: ICoach[] = null;

  totalCount: number = 0;
  activeCount: number = 0;
  dormantCount: number = 0;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private coachesService: CoachesService,
    private authorizationService: AuthorizationService) {
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      'nameFilter': [''],
      'currentlyActive': [false]
    });

    this.filterForm.valueChanges
      .subscribe(formValues => { 
        this.filterCoaches(formValues)
      });

    this.coachesService.readCoaches()
      .subscribe({
        next: response => {
          this.processReturnedCoaches(response.body.coaches);
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
    
    this.filteredCoaches
      .sort((coach1: any, coach2: any) => {
        let returnValue: number = 1;

        if (coach1[this.sortKey] < coach2[this.sortKey]) {
          returnValue = -1;
        }
        else if (coach1[this.sortKey] === coach2[this.sortKey]) {
          returnValue = 0;
        }

        if (this.reverse) {
          returnValue = returnValue * -1;
        }
        
        return returnValue;
      });
  }

  onClickAddCoach() {
    const modalRef: NgbModalRef = this.modalService.open(CoachFormComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.currentCoaches = this.coaches;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Coach Successfully Added', returnObject.coachDetails.emailAddress);

          this.processReturnedCoaches(returnObject.updatedCoaches);
        }

        this.nameFilterElementRef.nativeElement.focus();
      })
      .catch(error => {
        this.toasterService.pop('error', 'Failed Adding Coach', error.coachDetails.emailAddress);
      });
  }

  onClickEditCoach(coach: ICoach) {
    const modalRef: NgbModalRef = this.modalService.open(CoachFormComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.coachDetails = coach;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Coach Successfully Updated', returnObject.coachDetails.emailAddress);

          this.processReturnedCoaches(returnObject.updatedCoaches);
        }
      })
      .catch(error => {
        this.toasterService.pop('error', 'Failed Updating Coach', error.coachDetails.emailAddress);
      });
  }

  onClickDeleteCoach(coach: ICoach) {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmDeleteCoachComponent, { backdrop: 'static' });

    modalRef.componentInstance.coachDetails = coach;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Coach Successfully Deleted', returnObject.coachDetails.emailAddress);

          this.processReturnedCoaches(returnObject.updatedCoaches);
        }

        this.nameFilterElementRef.nativeElement.focus();
      })
      .catch(error => {
        this.toasterService.pop('error', 'Failed Deleting Coach', error.coachDetails.emailAddress);
      });
  }

  onClickDownloadCSV() {
    let csvCoaches: any[] = [];

    this.filteredCoaches.forEach(coach => {
      let csvCoach: any = {};
      
      csvCoach.emailAddress = coach.emailAddress;
      csvCoach.surname = coach.surname;
      csvCoach.firstName = coach.firstName;
      csvCoach.phoneNumber = coach.phoneNumber;
      csvCoach.administrator = coach.isAdministrator ? 'YES' : 'NO';

      csvCoaches.push(csvCoach);
    });

    this.coachesService.downloadCSV(csvCoaches);
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

  coachStateCSSClass(coach: ICoach) {
    var CSSClass = 'badge-success';

    if (!coach.active) {
      CSSClass = 'badge-warning';
    }

    return CSSClass;
  }

  filterCoaches(formValues: any) {
    this.filteredCoaches = this.coaches
      .filter(coach => {
        let nameFilter = formValues.nameFilter;

        if (nameFilter === null) {
          nameFilter = '';
        }

        if ((coach.firstName.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1 ||
            coach.surname.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1)
              && 
            !(formValues.currentlyActive && !coach.active)) {
          return true;
        }
      });
    
    this.onClickHeader(this.sortKey, false);
  }

  private processReturnedCoaches(coaches: ICoach[]) {
    let userProfile: IUserProfile = this.authorizationService.getActivePayload.userProfile;

    this.coaches = coaches;

    this.totalCount = 0;
    this.activeCount = 0;
    this.dormantCount = 0;

    this.coaches.forEach(coach => {
      this.totalCount++;

      if (coach.active) {
        this.activeCount++;              
      }
      else {
        this.dormantCount++;
      }

      if (coach.emailAddress === userProfile.ID) {
        coach.currentSessionOwner = true;
      }
    });

    this.filteredCoaches = this.coaches.slice(0);

    this.onClickHeader(this.sortKey, false);
  }
}
