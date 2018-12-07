import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { SharedModule } from '../../../../shared/shared.module';

import { GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { GroupPopupComponent } from '../group-popup/group-popup.component';
import { ManageGroupsComponent } from './manage-groups.component';


describe('ManageGroupsComponent', () => {
  let component: ManageGroupsComponent;
  let fixture: ComponentFixture<ManageGroupsComponent>;

  let groupsService: GroupsService,
      toasterService: ToasterService,
      modalService: NgbModal;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManageGroupsComponent,
        GroupPopupComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot(),
        SharedModule
      ],
      providers: [
        GroupsService,
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
    fixture = TestBed.createComponent(ManageGroupsComponent);
    component = fixture.componentInstance;

    groupsService = TestBed.get(GroupsService);
    toasterService = TestBed.get(ToasterService);
    modalService = TestBed.get(NgbModal);

    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': [
            {
              '_id': 'dfe674827f95ff37765ba0fc',
              'name': 'Under 10',
              'yearOfBirth': 2008,
              'footballManager': 'angel_klein@carraigog.com',
              'hurlingManager': 'heddwyn_cunningham@carraigog.com',
              'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-02-27T15:57:21.582Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
            },
            {
              '_id': '24eef4f773a9cc7b17a539e9',
              'name': 'Under 9',
              'yearOfBirth': 2009,
              'footballManager': 'john_rees@carraigog.com',
              'hurlingManager': 'bryok_moran@carraigog.com',
              'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-07-26T16:29:25.372Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
            },
            {
              '_id': '6cc1fec86fb94e11121dcf2a',
              'name': 'Under 8',
              'yearOfBirth': 2010,
              'footballManager': 'siward_hansen@carraigog.com',
              'hurlingManager': 'rowan_love@carraigog.com',
              'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-02-28T11:22:24.262Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
            },
            {
              '_id': '7f499865b3bbf13a60536e36',
              'name': 'Under 7',
              'yearOfBirth': 2011,
              'footballManager': 'winfield_owens@carraigog.com',
              'hurlingManager': 'sherlock_yang@carraigog.com',
              'lastUpdatedDate': '2018-01-10T16:00:20.439Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-01-10T16:00:20.439Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
            },
            {
              '_id': 'd387d6632a7750967c8f1b0d',
              'name': 'Under 6',
              'yearOfBirth': 2012,
              'footballManager': 'kylar_hart@carraigog.com',
              'hurlingManager': 'lachlan_johnson@carraigog.com',
              'lastUpdatedDate': '2018-03-01T12:20:39.338Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-03-01T12:20:39.338Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
            },
            {
              '_id': '00d7988eee11f94ad6bb5422',
              'name': 'Under 5',
              'year': 2018,
              'yearOfBirth': 2013,
              'footballManager': 'erick_norris@carraigog.com',
              'hurlingManager': 'erick_norris@carraigog.com',
              'lastUpdatedDate': '2018-02-27T12:09:40.660Z',
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-02-27T12:09:40.660Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0
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

  it('should call groupsService.readGroups', () => {
    expect(groupsService.readGroups).toHaveBeenCalled();
  });

  it('should display total count', () => {
    expect(fixture.nativeElement.querySelector('#total-count').innerHTML).toEqual('Total 6');
  });

  it('should display first group', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1)')).toBeTruthy();
  });

  it('should display last coach', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6)')).toBeTruthy();
  });

  it('should display name', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1)').innerHTML).toEqual('Under 10');
  });

  it('should display football manager', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(2) > td:nth-child(2)').innerHTML).toEqual('john_rees@carraigog.com');
  });

  it('should display hurling manager', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(3)').innerHTML).toEqual('rowan_love@carraigog.com');
  });

  it('should display last updated date', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(4) > td:nth-child(4)').innerHTML).toEqual('10/01/2018 4:00 PM');
  });

  it('should display edit link', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(2) > td:nth-child(5) > a > span').innerHTML).toEqual('Edit');
  });

  it('should default sort by name (first group)', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1)').innerHTML).toEqual('Under 10');
  });

  it('should default sort by name (last group)', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6) > td:nth-child(1)').innerHTML).toEqual('Under 5');
  });

  it('should sort by football manager (first group)', () => {
    component.onClickHeader('footballManager');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('angel_klein@carraigog.com');
  });

  it('should sort by football manager (last group)', () => {
    component.onClickHeader('footballManager');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6) > td:nth-child(2)').innerHTML).toEqual('winfield_owens@carraigog.com');
  });

  it('should sort by hurling manager (first group)', () => {
    component.onClickHeader('hurlingManager');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('bryok_moran@carraigog.com');
  });

  it('should sort by hurling manager (last group)', () => {
    component.onClickHeader('hurlingManager');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6) > td:nth-child(3)').innerHTML).toEqual('sherlock_yang@carraigog.com');
  });

  it('should sort by last updated date (first group)', () => {
    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(4)').innerHTML).toEqual('10/01/2018 4:00 PM');
  });

  it('should sort by last updated date (last group)', () => {
    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6) > td:nth-child(4)').innerHTML).toEqual('26/07/2018 4:29 PM');
  });

  it('should flip existing sort (first group)', () => {
    component.onClickHeader('hurlingManager');

    fixture.detectChanges();

    component.onClickHeader('hurlingManager');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('sherlock_yang@carraigog.com');
  });

  it('should flip existing sort (last group)', () => {
    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(6) > td:nth-child(4)').innerHTML).toEqual('10/01/2018 4:00 PM');
  });

  it('should filter on manager email address', () => {
    component.filterForm.controls['managerFilter'].setValue('winfield');

    fixture.detectChanges();

    component.filterGroups(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#groups-table > tbody > tr').length).toEqual(1);
  });

  it('should display filter message', () => {
    component.filterForm.controls['managerFilter'].setValue('norris');

    fixture.detectChanges();

    component.filterGroups(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 1 Groups');
  });

  it('should call NgbModal.open when a group is selected', () => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow({
      '_id': '6cc1fec86fb94e11121dcf2a',
      'name': 'Under 8',
      'yearOfBirth': 2010,
      'footballManager': 'siward_hansen@carraigog.com',
      'hurlingManager': 'rowan_love@carraigog.com',
      'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-02-28T11:22:24.262Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0
    });

    expect(modalService.open).toHaveBeenCalled();
  });

  // it('should download CSV of current filter', () => {
  //   spyOn(coachesService, 'downloadCSV')

  //   component.filterForm.controls['nameFilter'].setValue('r');

  //   fixture.detectChanges();

  //   component.filterCoaches(component.filterForm.value);

  //   fixture.detectChanges();

  //   component.onClickDownloadCSV();

  //   expect(coachesService.downloadCSV).toHaveBeenCalledWith([
  //     {
  //       'emailAddress': 'admin@carraigog.com',
  //       'surname': '',
  //       'firstName': 'Administrator',
  //       'phoneNumber': '086 1550344',
  //       'administrator': 'YES'
  //     },
  //     {
  //       'emailAddress': 'erick_norris@carraigog.com',
  //       'surname': 'Norris',
  //       'firstName': 'Erick',
  //       'phoneNumber': '086 6095372',
  //       'administrator': 'NO'
  //     }
  //   ]);
  // });

  // it('should process returned coaches after edit coach', fakeAsync(() => {
  //   spyOn(modalService, 'open')
  //     .and.returnValue({
  //       componentInstance: {},
  //       result: Promise.resolve({
  //         coachDetails: {
  //           '_id': '6293c9a83fd22e7fa8e66d3f',
  //           'firstName': 'Erick',
  //           'surname': 'Norris',
  //           'emailAddress': 'erick_norris@carraigog.com',
  //           'phoneNumber': '086 9998888',
  //           'isAdministrator': false,
  //           'createdBy': 'script',
  //           'createdDate': '2017-03-15T13:43:51.268Z',
  //           'updatedDate': '2018-05-09T09:55:59.735Z',
  //           'updatedBy': 'administrator@carraigog.com',
  //           '__v': 0,
  //           'active': true,
  //           'currentSessionOwner': false
  //         },
  //         updatedCoaches: [
  //           {
  //             '_id': 'b093d6d273adfb49ae33e6e1',
  //             'firstName': 'Administrator',
  //             'surname': '',
  //             'emailAddress': 'admin@carraigog.com',
  //             'phoneNumber': '086 1550344',
  //             'isAdministrator': true,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': false,
  //             'currentSessionOwner': true
  //           },
  //           {
  //             '_id': '6293c9a83fd22e7fa8e66d3f',
  //             'firstName': 'Erick',
  //             'surname': 'Norris',
  //             'emailAddress': 'erick_norris@carraigog.com',
  //             'phoneNumber': '086 9998888',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           },
  //           {
  //             '_id': '77b61339ebb9c8fc7c51618a',
  //             'firstName': 'Lachlan',
  //             'surname': 'Johnson',
  //             'emailAddress': 'lachlan_johnson@carraigog.com',
  //             'phoneNumber': '086 4449465',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           },
  //           {
  //             '_id': '573d088683acbba74068c0ea',
  //             'firstName': 'Angel',
  //             'surname': 'Klein',
  //             'emailAddress': 'angel_klein@carraigog.com',
  //             'phoneNumber': '086 2175716',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           }
  //         ]
  //       })
  //     });

  //   component.onClickEditCoach(new MouseEvent('click'), {
  //     '_id': '6293c9a83fd22e7fa8e66d3f',
  //     'firstName': 'Erick',
  //     'surname': 'Norris',
  //     'emailAddress': 'erick_norris@carraigog.com',
  //     'phoneNumber': '086 6095372',
  //     'isAdministrator': false,
  //     'createdBy': 'script',
  //     'createdDate': '2017-03-15T13:43:51.268Z',
  //     'updatedDate': '2018-05-09T09:55:59.735Z',
  //     'updatedBy': 'administrator@carraigog.com',
  //     '__v': 0,
  //     'active': true,
  //     'currentSessionOwner': false
  //   });

  //   tick();

  //   expect(JSON.stringify(component.coaches)).toEqual(JSON.stringify([
  //     {
  //       '_id': 'b093d6d273adfb49ae33e6e1',
  //       'firstName': 'Administrator',
  //       'surname': '',
  //       'emailAddress': 'admin@carraigog.com',
  //       'phoneNumber': '086 1550344',
  //       'isAdministrator': true,
  //       'createdBy': 'script',
  //       'createdDate': '2017-03-15T13:43:51.268Z',
  //       'updatedDate': '2018-05-09T09:55:59.735Z',
  //       'updatedBy': 'administrator@carraigog.com',
  //       '__v': 0,
  //       'active': false,
  //       'currentSessionOwner': true
  //     },
  //     {
  //       '_id': '6293c9a83fd22e7fa8e66d3f',
  //       'firstName': 'Erick',
  //       'surname': 'Norris',
  //       'emailAddress': 'erick_norris@carraigog.com',
  //       'phoneNumber': '086 9998888',
  //       'isAdministrator': false,
  //       'createdBy': 'script',
  //       'createdDate': '2017-03-15T13:43:51.268Z',
  //       'updatedDate': '2018-05-09T09:55:59.735Z',
  //       'updatedBy': 'administrator@carraigog.com',
  //       '__v': 0,
  //       'active': true,
  //       'currentSessionOwner': false
  //     },
  //     {
  //       '_id': '77b61339ebb9c8fc7c51618a',
  //       'firstName': 'Lachlan',
  //       'surname': 'Johnson',
  //       'emailAddress': 'lachlan_johnson@carraigog.com',
  //       'phoneNumber': '086 4449465',
  //       'isAdministrator': false,
  //       'createdBy': 'script',
  //       'createdDate': '2017-03-15T13:43:51.268Z',
  //       'updatedDate': '2018-05-09T09:55:59.735Z',
  //       'updatedBy': 'administrator@carraigog.com',
  //       '__v': 0,
  //       'active': true,
  //       'currentSessionOwner': false
  //     },
  //     {
  //       '_id': '573d088683acbba74068c0ea',
  //       'firstName': 'Angel',
  //       'surname': 'Klein',
  //       'emailAddress': 'angel_klein@carraigog.com',
  //       'phoneNumber': '086 2175716',
  //       'isAdministrator': false,
  //       'createdBy': 'script',
  //       'createdDate': '2017-03-15T13:43:51.268Z',
  //       'updatedDate': '2018-05-09T09:55:59.735Z',
  //       'updatedBy': 'administrator@carraigog.com',
  //       '__v': 0,
  //       'active': true,
  //       'currentSessionOwner': false
  //     }
  //   ]));
  // }));

  // it('should display successfully edited coach popup', fakeAsync(() => {
  //   spyOn(modalService, 'open')
  //     .and.returnValue({
  //       componentInstance: {},
  //       result: Promise.resolve({
  //         coachDetails: {
  //           '_id': '6293c9a83fd22e7fa8e66d3f',
  //           'firstName': 'Erick',
  //           'surname': 'Norris',
  //           'emailAddress': 'erick_norris@carraigog.com',
  //           'phoneNumber': '086 9998888',
  //           'isAdministrator': false,
  //           'createdBy': 'script',
  //           'createdDate': '2017-03-15T13:43:51.268Z',
  //           'updatedDate': '2018-05-09T09:55:59.735Z',
  //           'updatedBy': 'administrator@carraigog.com',
  //           '__v': 0,
  //           'active': true,
  //           'currentSessionOwner': false
  //         },
  //         updatedCoaches: [
  //           {
  //             '_id': 'b093d6d273adfb49ae33e6e1',
  //             'firstName': 'Administrator',
  //             'surname': '',
  //             'emailAddress': 'admin@carraigog.com',
  //             'phoneNumber': '086 1550344',
  //             'isAdministrator': true,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': false,
  //             'currentSessionOwner': true
  //           },
  //           {
  //             '_id': '6293c9a83fd22e7fa8e66d3f',
  //             'firstName': 'Erick',
  //             'surname': 'Norris',
  //             'emailAddress': 'erick_norris@carraigog.com',
  //             'phoneNumber': '086 9998888',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           },
  //           {
  //             '_id': '77b61339ebb9c8fc7c51618a',
  //             'firstName': 'Lachlan',
  //             'surname': 'Johnson',
  //             'emailAddress': 'lachlan_johnson@carraigog.com',
  //             'phoneNumber': '086 4449465',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           },
  //           {
  //             '_id': '573d088683acbba74068c0ea',
  //             'firstName': 'Angel',
  //             'surname': 'Klein',
  //             'emailAddress': 'angel_klein@carraigog.com',
  //             'phoneNumber': '086 2175716',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           },
  //           {
  //             '_id': 'f9d2e596bb0fffebad95ae6a',
  //             'firstName': 'Siward',
  //             'surname': 'Hansen',
  //             'emailAddress': 'siward_hansen@carraigog.com',
  //             'phoneNumber': '086 1949623',
  //             'password': 'Password01#',
  //             'isAdministrator': false,
  //             'createdBy': 'script',
  //             'createdDate': '2017-03-15T13:43:51.268Z',
  //             'updatedDate': '2018-05-09T09:55:59.735Z',
  //             'updatedBy': 'administrator@carraigog.com',
  //             '__v': 0,
  //             'active': true,
  //             'currentSessionOwner': false
  //           }  
  //         ]
  //       })
  //     });

  //   component.onClickEditCoach(new MouseEvent('click'), {
  //     '_id': '6293c9a83fd22e7fa8e66d3f',
  //     'firstName': 'Erick',
  //     'surname': 'Norris',
  //     'emailAddress': 'erick_norris@carraigog.com',
  //     'phoneNumber': '086 9998888',
  //     'isAdministrator': false,
  //     'createdBy': 'script',
  //     'createdDate': '2017-03-15T13:43:51.268Z',
  //     'updatedDate': '2018-05-09T09:55:59.735Z',
  //     'updatedBy': 'administrator@carraigog.com',
  //     '__v': 0,
  //     'active': true,
  //     'currentSessionOwner': false
  //   });

  //   tick();

  //   expect(toasterService.pop).toHaveBeenCalledWith('success', 'Coach Successfully Updated', 'erick_norris@carraigog.com');
  // }));

  // it('should display failed editing coach popup', fakeAsync(() => {
  //   spyOn(modalService, 'open')
  //     .and.returnValue({
  //       componentInstance: {},
  //       result: Promise.reject({
  //         coachDetails: {
  //           '_id': '6293c9a83fd22e7fa8e66d3f',
  //           'firstName': 'Erick',
  //           'surname': 'Norris',
  //           'emailAddress': 'erick_norris@carraigog.com',
  //           'phoneNumber': '086 9998888',
  //           'isAdministrator': false,
  //           'createdBy': 'script',
  //           'createdDate': '2017-03-15T13:43:51.268Z',
  //           'updatedDate': '2018-05-09T09:55:59.735Z',
  //           'updatedBy': 'administrator@carraigog.com',
  //           '__v': 0,
  //           'active': true,
  //           'currentSessionOwner': false
  //         }
  //       })
  //     });

  //   component.onClickEditCoach(new MouseEvent('click'), {
  //     '_id': '6293c9a83fd22e7fa8e66d3f',
  //     'firstName': 'Erick',
  //     'surname': 'Norris',
  //     'emailAddress': 'erick_norris@carraigog.com',
  //     'phoneNumber': '086 9998888',
  //     'isAdministrator': false,
  //     'createdBy': 'script',
  //     'createdDate': '2017-03-15T13:43:51.268Z',
  //     'updatedDate': '2018-05-09T09:55:59.735Z',
  //     'updatedBy': 'administrator@carraigog.com',
  //     '__v': 0,
  //     'active': true,
  //     'currentSessionOwner': false
  //   });

  //   tick();

  //   expect(toasterService.pop).toHaveBeenCalledWith('error', 'Failed Updating Coach', 'erick_norris@carraigog.com');
  // }));
});
