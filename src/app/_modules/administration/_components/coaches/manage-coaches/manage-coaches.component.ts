import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToasterService } from 'angular2-toaster';

import { ICoachSummary, IUserProfile } from '../../../../../_models/index';
import { CoachesService, AuthorizationService } from '../../../../../_services/index';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { CoachPopupComponent } from '../coach-popup/coach-popup.component';
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

  coaches: ICoachSummary[] = null;
  filteredCoaches: ICoachSummary[] = null;

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

    this.coachesService.readCoachSummaries()
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
      // Need this handler otherwise the Angular error handling mechanism will kick in.
      .catch(error => {
      });
  }

  onClickEditCoach(event: Event, coachSummary: ICoachSummary) {
    this.coachesService.readCoachDetails(coachSummary.id)
      .subscribe({
        next: response => {
          const modalRef: NgbModalRef = this.modalService.open(CoachFormComponent, { size: 'lg', backdrop: 'static' });

          modalRef.componentInstance.coachDetails = response.body.coachDetails;
          modalRef.componentInstance.activeCoach = coachSummary.active;
          modalRef.componentInstance.currentCoaches = this.coaches;
            
          modalRef.result
            .then(returnObject => {
              if (returnObject) {
                this.toasterService.pop('success', 'Coach Successfully Updated', returnObject.coachDetails.emailAddress);

                this.processReturnedCoaches(returnObject.updatedCoaches);
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

  onClickDeleteCoach(event: Event, coachSummary: ICoachSummary) {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmDeleteCoachComponent, { backdrop: 'static' });

    modalRef.componentInstance.coachSummary = coachSummary;

    modalRef.result
      .then(returnObject => {
        if (returnObject) {
          this.toasterService.pop('success', 'Coach Successfully Deleted', coachSummary.emailAddress);

          this.processReturnedCoaches(returnObject.updatedCoaches);
        }

        this.nameFilterElementRef.nativeElement.focus();
      })
      // Need this handler otherwise the Angular error handling mechanism will kick in.
      .catch(error => {
      });

    event.stopPropagation();
  }

  onClickRow(coachSummary: ICoachSummary) {
    let modalRef: NgbModalRef;

    this.coachesService.readCoachDetails(coachSummary.id)
      .subscribe({
        next: response => {
          modalRef = this.modalService.open(CoachPopupComponent);

          modalRef.componentInstance.coachDetails = response.body.coachDetails;  
          modalRef.componentInstance.coachGroups = response.body.coachRoles;
          modalRef.componentInstance.active = coachSummary.active;
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
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
      csvCoach.administrator = coach.administrator ? 'YES' : 'NO';
      csvCoach.active = coach.active ? 'YES' : 'NO';

      csvCoaches.push(csvCoach);
    });

    this.coachesService.downloadCSV(csvCoaches);
  }

  // This is public for the unit tests.
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

  coachStateCSSClass(coachSummary: ICoachSummary) {
    var CSSClass = 'badge-success';

    if (!coachSummary.active) {
      CSSClass = 'badge-warning';
    }

    return CSSClass;
  }

  private processReturnedCoaches(coaches: ICoachSummary[]) {
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
