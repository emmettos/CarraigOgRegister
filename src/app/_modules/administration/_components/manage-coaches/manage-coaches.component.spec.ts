import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler } from 'rxjs';

import { NgbModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule, ToasterService, ToasterService } from 'angular2-toaster';

import { CoachesService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { ManageCoachesComponent } from './manage-coaches.component';


fdescribe('ManageCoachesComponent', () => {
  let component: ManageCoachesComponent;
  let fixture: ComponentFixture<ManageCoachesComponent>;

  let coachesService: CoachesService,
      toasterService: ToasterService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManageCoachesComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot()
      ],
      providers: [
        CoachesService,
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
    toasterService = TestBed.get(ToasterService);

    spyOn(coachesService, 'readCoaches')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coaches': [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
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

  it('should call coachesService.readCoaches', () => {
    expect(coachesService.readCoaches).toHaveBeenCalled();
  });

  it('should display total count', () => {
    expect(fixture.nativeElement.querySelector('#total-count').innerHTML).toEqual('Total 4');
  });

  it('should display active count', () => {
    expect(fixture.nativeElement.querySelector('#active-count').innerHTML).toEqual('Active 3');
  });

  it('should display dormant count', () => {
    expect(fixture.nativeElement.querySelector('#dormant-count').innerHTML).toEqual('Dormant 1');
  });

  it('should display first coach', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1)')).toBeTruthy();
  });

  it('should display last coach', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4)')).toBeTruthy();
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
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('angel_klein@carraigog.com');
  });

  it('should display phone number', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4) > td:nth-child(5)').innerHTML).toEqual('086 6095372');
  });

  it('should display isAdministrator', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML).toEqual('YES');
  });

  it('should display edit link', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(2) > td:nth-child(7) > a > span').innerHTML).toEqual('Edit');
  });

  it('should display delete link', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(3) > td:nth-child(8) > a > span').innerHTML).toEqual('Delete');
  });

  it('should highlight dormant coaches', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('missing')).toEqual('');
  });

  it('should default sort by surname (first coach)', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('');
  });

  it('should default sort by surname (last coach)', () => {
    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4) > td:nth-child(2)').innerHTML).toEqual('Norris');
  });

  it('should sort by coach state (first coach)', () => {
    component.onClickHeader('coachState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should sort by coach state (last coach)', () => {
    component.onClickHeader('coachState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should sort by phone number (first coach)', () => {
    component.onClickHeader('phoneNumber');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('086 1550344');
  });

  it('should sort by phone number (last coach)', () => {
    component.onClickHeader('phoneNumber');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4) > td:nth-child(5)').innerHTML).toEqual('086 6095372');
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

    expect(fixture.nativeElement.querySelector('#coaches-table > tbody > tr:nth-child(4) > td:nth-child(4)').innerHTML).toEqual('admin@carraigog.com');
  });

  it('should display currently registered coaches', () => {
    component.filterForm.controls['currentlyActive'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#coaches-table > tbody > tr').length).toEqual(3);
  });

  it('should filter on coach name', () => {
    component.filterForm.controls['nameFilter'].setValue('Angel');

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

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 2 Coaches');
  });

  it('should download CSV of current filter', () => {
    spyOn(coachesService, 'downloadCSV')

    component.filterForm.controls['nameFilter'].setValue('r');

    fixture.detectChanges();

    component.filterCoaches(component.filterForm.value);

    fixture.detectChanges();

    component.onClickDownloadCSV();

    expect(coachesService.downloadCSV).toHaveBeenCalledWith([
      {
        'emailAddress': 'admin@carraigog.com',
        'surname': '',
        'firstName': 'Administrator',
        'phoneNumber': '086 1550344',
        'administrator': 'YES'
      },
      {
        'emailAddress': 'erick_norris@carraigog.com',
        'surname': 'Norris',
        'firstName': 'Erick',
        'phoneNumber': '086 6095372',
        'administrator': 'NO'
      }
    ]);
  });

  it('should process returned coaches after add coach', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        result: Promise.resolve({
          coachDetails: {
            'emailAddress': 'siward_hansen@carraigog.com',
            'firstName': 'Siward',
            'surname': 'Hansen',
            'phoneNumber': '086 1949623',
            'isAdministrator': false
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': 'f9d2e596bb0fffebad95ae6a',
              'firstName': 'Siward',
              'surname': 'Hansen',
              'emailAddress': 'siward_hansen@carraigog.com',
              'phoneNumber': '086 1949623',
              'password': 'Password01#',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              active: true
            }  
          ]
        })
      });

    component.onClickAddCoach();

    tick();

    expect(JSON.stringify(component.coaches)).toEqual(JSON.stringify([
      {
        '_id': '573d088683acbba74068c0ea',
        'firstName': 'Angel',
        'surname': 'Klein',
        'emailAddress': 'angel_klein@carraigog.com',
        'phoneNumber': '086 2175716',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': '77b61339ebb9c8fc7c51618a',
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': 'b093d6d273adfb49ae33e6e1',
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': false
      },
      {
        '_id': 'f9d2e596bb0fffebad95ae6a',
        'firstName': 'Siward',
        'surname': 'Hansen',
        'emailAddress': 'siward_hansen@carraigog.com',
        'phoneNumber': '086 1949623',
        'password': 'Password01#',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      }
    ]));
  }));

  it('should display successfully added coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        result: Promise.resolve({
          coachDetails: {
            'emailAddress': 'siward_hansen@carraigog.com',
            'firstName': 'Siward',
            'surname': 'Hansen',
            'phoneNumber': '086 1949623',
            'isAdministrator': false
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': 'f9d2e596bb0fffebad95ae6a',
              'firstName': 'Siward',
              'surname': 'Hansen',
              'emailAddress': 'siward_hansen@carraigog.com',
              'phoneNumber': '086 1949623',
              'password': 'Password01#',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              active: true
            }  
          ]
        })
      });

    component.onClickAddCoach();

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Added', 'siward_hansen@carraigog.com');
  }));

  it('should display failed adding coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        result: Promise.reject({
          coachDetails: {
            'emailAddress': 'siward_hansen@carraigog.com',
            'firstName': 'Siward',
            'surname': 'Hansen',
            'phoneNumber': '086 1949623',
            'isAdministrator': false
          }
        })
      });

    component.onClickAddCoach();

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('error', 'Failed Adding Coach', 'siward_hansen@carraigog.com');
  }));

  it('should process returned coaches after edit coach', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: {
            '_id': '6293c9a83fd22e7fa8e66d3f',
            'firstName': 'Erick',
            'surname': 'Norris',
            'emailAddress': 'erick_norris@carraigog.com',
            'phoneNumber': '086 9998888',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 9998888',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        })
      });

    component.onClickEditCoach({
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(JSON.stringify(component.coaches)).toEqual(JSON.stringify([
      {
        '_id': '573d088683acbba74068c0ea',
        'firstName': 'Angel',
        'surname': 'Klein',
        'emailAddress': 'angel_klein@carraigog.com',
        'phoneNumber': '086 2175716',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 9998888',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': '77b61339ebb9c8fc7c51618a',
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': 'b093d6d273adfb49ae33e6e1',
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': false
      }
    ]));
  }));

  it('should display successfully edited coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: {
            '_id': '6293c9a83fd22e7fa8e66d3f',
            'firstName': 'Erick',
            'surname': 'Norris',
            'emailAddress': 'erick_norris@carraigog.com',
            'phoneNumber': '086 9998888',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 9998888',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': 'f9d2e596bb0fffebad95ae6a',
              'firstName': 'Siward',
              'surname': 'Hansen',
              'emailAddress': 'siward_hansen@carraigog.com',
              'phoneNumber': '086 1949623',
              'password': 'Password01#',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              active: true
            }  
          ]
        })
      });

    component.onClickEditCoach({
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 9998888',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Updated', 'erick_norris@carraigog.com');
  }));

  it('should display failed editing coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.reject({
          coachDetails: {
            '_id': '6293c9a83fd22e7fa8e66d3f',
            'firstName': 'Erick',
            'surname': 'Norris',
            'emailAddress': 'erick_norris@carraigog.com',
            'phoneNumber': '086 9998888',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          }
        })
      });

    component.onClickEditCoach({
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 9998888',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('error', 'Failed Updating Coach', 'erick_norris@carraigog.com');
  }));

  it('should process returned coaches after delete coach', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: {
            '_id': '77b61339ebb9c8fc7c51618a',
            'firstName': 'Lachlan',
            'surname': 'Johnson',
            'emailAddress': 'lachlan_johnson@carraigog.com',
            'phoneNumber': '086 4449465',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 9998888',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        })
      });

    component.onClickDeleteCoach({
      '_id': '77b61339ebb9c8fc7c51618a',
      'firstName': 'Lachlan',
      'surname': 'Johnson',
      'emailAddress': 'lachlan_johnson@carraigog.com',
      'phoneNumber': '086 4449465',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(JSON.stringify(component.coaches)).toEqual(JSON.stringify([
      {
        '_id': '573d088683acbba74068c0ea',
        'firstName': 'Angel',
        'surname': 'Klein',
        'emailAddress': 'angel_klein@carraigog.com',
        'phoneNumber': '086 2175716',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 9998888',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true
      },
      {
        '_id': 'b093d6d273adfb49ae33e6e1',
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'isAdministrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': false
      }
    ]));
  }));

  it('should display successfully deleted coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          coachDetails: {
            '_id': '6293c9a83fd22e7fa8e66d3f',
            'firstName': 'Erick',
            'surname': 'Norris',
            'emailAddress': 'erick_norris@carraigog.com',
            'phoneNumber': '086 6095372',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          },
          updatedCoaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false
            },
            {
              '_id': '77b61339ebb9c8fc7c51618a',
              'firstName': 'Lachlan',
              'surname': 'Johnson',
              'emailAddress': 'lachlan_johnson@carraigog.com',
              'phoneNumber': '086 4449465',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            },
            {
              '_id': '573d088683acbba74068c0ea',
              'firstName': 'Angel',
              'surname': 'Klein',
              'emailAddress': 'angel_klein@carraigog.com',
              'phoneNumber': '086 2175716',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        })
      });

    component.onClickDeleteCoach({
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Deleted', 'erick_norris@carraigog.com');
  }));

  it('should display failed deleting coach popup', fakeAsync(() => {
    let modalService: NgbModal;
    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.reject({
          coachDetails: {
            '_id': '6293c9a83fd22e7fa8e66d3f',
            'firstName': 'Erick',
            'surname': 'Norris',
            'emailAddress': 'erick_norris@carraigog.com',
            'phoneNumber': '086 6095372',
            'isAdministrator': false,
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-05-09T09:55:59.735Z',
            'updatedBy': 'administrator@carraigog.com',
            '__v': 0,
            'active': true
          }
        })
      });

    component.onClickDeleteCoach({
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    });

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('error', 'Failed Deleting Coach', 'erick_norris@carraigog.com');
  }));
});
