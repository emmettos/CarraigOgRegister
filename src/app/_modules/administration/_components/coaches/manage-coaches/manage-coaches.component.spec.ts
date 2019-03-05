import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';

import { NgbModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { SharedModule } from '../../../../shared/shared.module';

import { ICoach, ICoachSummary } from '../../../../../_models';

import { CoachesService, AuthorizationService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { CoachPopupComponent } from '../coach-popup/coach-popup.component';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { ConfirmDeleteCoachComponent } from '../confirm-delete-coach/confirm-delete-coach.component';
import { ManageCoachesComponent } from './manage-coaches.component';


describe('ManageCoachesComponent', () => {
  let component: ManageCoachesComponent;
  let fixture: ComponentFixture<ManageCoachesComponent>;

  let coachesService: CoachesService,
      authorizationService: AuthorizationService,
      toasterService: ToasterService,
      modalService: NgbModal;
  
  let coachDetails: ICoach,
      newCoachDetails: ICoach,
      updatedCoachDetails: ICoach,
      coachSummary: ICoachSummary,
      updatedCoachesAfterAdd: ICoachSummary[],
      updatedCoachesAfterEdit: ICoachSummary[],
      updatedCoachesAfterDelete: ICoachSummary[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManageCoachesComponent,
        CoachPopupComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot(),
        SharedModule
      ],
      providers: [
        CoachesService,
        AuthorizationService,
        ValidationService,
        ToasterService,
        NgbActiveModal
      ],
      schemas: [ 
        NO_ERRORS_SCHEMA 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCoachesComponent);
    component = fixture.componentInstance;

    coachesService = TestBed.get(CoachesService);
    authorizationService = TestBed.get(AuthorizationService);
    toasterService = TestBed.get(ToasterService);
    modalService = TestBed.get(NgbModal);

    coachDetails = {
      'id': 2,
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'administrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-05-09T09:55:59.735Z'
    };

    newCoachDetails = {
      'firstName': 'Angel',
      'surname': 'Klein',
      'emailAddress': 'angel_klein@carraigog.com',
      'phoneNumber': '086 2175716',
      'administrator': false,
    } as ICoach;

    updatedCoachDetails = {
      'id': 2,
      'firstName': 'Erick',
      'surname': 'NorrisXXX',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'administrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-05-09T09:55:59.735Z'
    };

    coachSummary = {
      'id': 2,
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'administrator': false,
      'version': '2018-05-09T09:55:59.735Z',
      'active': true,
      'currentSessionOwner': false
    };

    updatedCoachesAfterAdd = [
      {
        'id': 1,
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'administrator': true,
        'version': '2018-05-09T09:55:59.735Z',
        'active': false,
        'currentSessionOwner': true
      },
      {
        'id': 2,
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      },
      {
        'id': 3,
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      },
      {
        'id': 4,
        'firstName': 'Angel',
        'surname': 'Klein',
        'emailAddress': 'angel_klein@carraigog.com',
        'phoneNumber': '086 2175716',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false  
      }
    ];

    updatedCoachesAfterEdit = [
      {
        'id': 1,
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'administrator': true,
        'version': '2018-05-09T09:55:59.735Z',
        'active': false,
        'currentSessionOwner': true
      },
      {
        'id': 2,
        'firstName': 'Erick',
        'surname': 'NorrisXXX',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      },
      {
        'id': 3,
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      }
    ];

    updatedCoachesAfterDelete = [
      {
        'id': 1,
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'administrator': true,
        'version': '2018-05-09T09:55:59.735Z',
        'active': false,
        'currentSessionOwner': true
      },
      {
        'id': 3,
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      }
    ];

    spyOnProperty(authorizationService, 'getActivePayload', 'get')
      .and.returnValue({
        userProfile: {
          ID: 'admin@carraigog.com',
          fullName: 'Administrator',
          isAdministrator: true
        }
      });

    spyOn(coachesService, 'readCoachSummaries')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coaches': [
            {
              'id': 1,
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'administrator': true,
              'version': '2018-05-09T09:55:59.735Z',
              'active': false,
              'currentSessionOwner': true
            },
            {
              'id': 2,
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            },
            {
              'id': 3,
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            }
          ]
        }  
      }));
      
    spyOn(toasterService, 'pop');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call coachesService.readCoachSummaries', () => {
    expect(coachesService.readCoachSummaries).toHaveBeenCalled();
  });

  it('should display total count', () => {
    expect(fixture.nativeElement.querySelector('#total-count').innerHTML).toEqual('Total 3');
  });

  it('should display active count', () => {
    expect(fixture.nativeElement.querySelector('#active-count').innerHTML).toEqual('Active 2');
  });

  it('should display dormant count', () => {
    expect(fixture.nativeElement.querySelector('#dormant-count').innerHTML).toEqual('Dormant 1');
  });

  it('should display first coach', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1)')).toBeTruthy();
  });

  it('should display last coach', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3)')).toBeTruthy();
  });

  it('should display active coach state', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should display dormant coach state', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should display surname', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('');
  });

  it('should display first name', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(2) > td:nth-child(3)').innerHTML).toEqual('Lachlan');
  });

  it('should display email address', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('erick_norris@carraigog.com');
  });

  it('should display phone number', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('086 1550344');
  });

  it('should display administrator', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML).toEqual('YES');
  });

  it('should display edit link', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(2) > td:nth-child(7) > a > span').innerHTML).toEqual('Edit');
  });

  it('should display delete link', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(8) > a > span').innerHTML).toEqual('Delete');
  });

  it('should not display delete link for logged on coach', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(8) > span').innerHTML).toEqual('');
  });

  it('should highlight dormant coaches', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('missing')).toEqual('');
  });

  it('should default sort by surname (first coach)', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('');
  });

  it('should default sort by surname (last coach)', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('Norris');
  });

  it('should sort by coach state (first coach)', () => {
    component.onClickHeader('coachState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should sort by coach state (last coach)', () => {
    component.onClickHeader('coachState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should sort by phone number (first coach)', () => {
    component.onClickHeader('phoneNumber');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('086 1550344');
  });

  it('should sort by phone number (last coach)', () => {
    component.onClickHeader('phoneNumber');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(5)').innerHTML).toEqual('086 6095372');
  });

  it('should flip existing sort (first coach)', () => {
    component.onClickHeader('firstName');

    fixture.detectChanges();

    component.onClickHeader('firstName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Lachlan');
  });

  it('should flip existing sort (last coach)', () => {
    component.onClickHeader('emailAddress');

    fixture.detectChanges();

    component.onClickHeader('emailAddress');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('admin@carraigog.com');
  });

  it('should display currently registered coaches', () => {
    component.filterForm.controls['currentlyActive'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#coaches-table > tbody > tr').length).toEqual(2);
  });

  it('should filter on coach name', () => {
    component.filterForm.controls['nameFilter'].setValue('Erick');

    fixture.detectChanges();

    component.filterCoaches(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#coaches-table > tbody > tr').length).toEqual(1);
  });

  it('should display filter message', () => {
    component.filterForm.controls['nameFilter'].setValue('l');

    fixture.detectChanges();

    component.filterCoaches(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 1 Coaches');
  });

  it('should call coachesService.readCoachDetails when a coach is selected', () => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow(coachSummary);

    expect(coachesService.readCoachDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when a coach is selected', () => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow(coachSummary);

    expect(modalService.open).toHaveBeenCalledWith(CoachPopupComponent);
  });

  it('should call NgbModal.open when add coach is selected', () => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: newCoachDetails,
          updatedCoaches: updatedCoachesAfterAdd
        })
      });

    component.onClickAddCoach();

    expect(modalService.open).toHaveBeenCalledWith(CoachFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully added coach popup', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: newCoachDetails,
          updatedCoaches: updatedCoachesAfterAdd
        })
      });

    component.onClickAddCoach();

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Added', 'angel_klein@carraigog.com');
  }));

  it('should display coaches after adding a coach', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: {
            'id': 4,
            'firstName': 'Angel',
            'surname': 'Klein',
            'emailAddress': 'angel_klein@carraigog.com',
            'phoneNumber': '086 2175716',
            'administrator': false,
            'version': '2018-05-09T09:55:59.735Z',
            'active': true,
            'currentSessionOwner': false
          },
          updatedCoaches: [
            {
              'id': 1,
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'administrator': true,
              'version': '2018-05-09T09:55:59.735Z',
              'active': false,
              'currentSessionOwner': true
            },
            {
              'id': 2,
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            },
            {
              'id': 3,
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            },
            {
              'id': 4,
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false  
            }
          ]
        })
      });

    component.onClickAddCoach();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('Klein');
  }));

  it('should call groupsService.readCoachDetails when edit coach is selected', () => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: updatedCoachDetails,
          updatedCoaches: updatedCoachesAfterEdit
        })
      });

      component.onClickRow(coachSummary);
  
    expect(coachesService.readCoachDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when edit coach is selected', () => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: updatedCoachDetails,
          updatedCoaches: updatedCoachesAfterEdit
        })
      });

    component.onClickEditCoach(new MouseEvent('click'), coachSummary);

    expect(modalService.open).toHaveBeenCalledWith(CoachFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully updated coach popup', fakeAsync(() => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: updatedCoachDetails,
          updatedCoaches: updatedCoachesAfterEdit
        })
      });

    component.onClickEditCoach(new MouseEvent('click'), coachSummary);
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Updated', 'erick_norris@carraigog.com');
  }));

  it('should display coaches after updating a coach', fakeAsync(() => {
    spyOn(coachesService, 'readCoachDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coachDetails': coachDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: updatedCoachDetails,
          updatedCoaches: updatedCoachesAfterEdit
        })
      });

    component.onClickEditCoach(new MouseEvent('click'), coachSummary);
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('NorrisXXX');
  }));

  it('should call NgbModal.open when delete coach is selected', () => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedCoaches: updatedCoachesAfterDelete 
        })
      });

    component.onClickDeleteCoach(new MouseEvent('click'), coachSummary);

    expect(modalService.open).toHaveBeenCalledWith(ConfirmDeleteCoachComponent, { backdrop: 'static' });
  });

  it('should display successfully deleted coach popup', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedCoaches: updatedCoachesAfterDelete 
        })
      });

    component.onClickDeleteCoach(new MouseEvent('click'), coachSummary);
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Deleted', 'erick_norris@carraigog.com');
  }));

  it('should display coaches after deleting a coach', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedCoaches: updatedCoachesAfterDelete 
        })
      });

    component.onClickDeleteCoach(new MouseEvent('click'), coachSummary);
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(2) > td:nth-child(2)').innerHTML).toEqual('Johnson');
  }));

  it('should download CSV of current filter', () => {
    spyOn(coachesService, 'downloadCSV')

    component.filterForm.controls['nameFilter'].setValue('Norris');

    fixture.detectChanges();

    component.filterCoaches(component.filterForm.value);

    fixture.detectChanges();

    component.onClickDownloadCSV();

    expect(coachesService.downloadCSV).toHaveBeenCalledWith([
      {
        'emailAddress': 'erick_norris@carraigog.com',
        'firstName': 'Erick',
        'surname': 'Norris',
        'phoneNumber': '086 6095372',
        'administrator': 'NO',
        'active': 'YES'
      }
    ]);
  });
});
