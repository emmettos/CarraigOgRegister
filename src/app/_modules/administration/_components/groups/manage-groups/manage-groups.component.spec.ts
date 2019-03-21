import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { SharedModule } from '../../../../shared/shared.module';

import { IGroup, IGroupSummary } from '../../../../../_models';

import { GroupsService, CoachesService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ManageGroupsComponent } from './manage-groups.component';
import { GroupPopupComponent } from '../group-popup/group-popup.component';
import { GroupFormComponent } from '../group-form/group-form.component';
import { ConfirmDeleteGroupComponent } from '../confirm-delete-group/confirm-delete-group.component';


describe('ManageGroupsComponent', () => {
  let component: ManageGroupsComponent;
  let fixture: ComponentFixture<ManageGroupsComponent>;

  let groupsService: GroupsService,
      coachesService: CoachesService,
      toasterService: ToasterService,
      modalService: NgbModal;
  
  let groupDetails: IGroup,
      newGroupDetails: IGroup,
      updatedGroupDetails: IGroup,
      groupSummary: IGroupSummary,
      updatedGroupsAfterAdd: IGroupSummary[],
      updatedGroupsAfterEdit: IGroupSummary[],
      updatedGroupsAfterDelete: IGroupSummary[];

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
    fixture = TestBed.createComponent(ManageGroupsComponent);
    component = fixture.componentInstance;

    groupsService = TestBed.get(GroupsService);
    coachesService = TestBed.get(CoachesService);
    toasterService = TestBed.get(ToasterService);
    modalService = TestBed.get(NgbModal);

    groupDetails = {
      'id': 2,
      'previousGroupId': 1,
      'yearId': 2,
      'yearOfBirth': 2010,      
      'name': 'Under 6',
      'footballCoachId': 1,
      'hurlingCoachId': 2,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-03-04T10:20:00.000Z',
    };

    newGroupDetails = {
      'yearOfBirth': 2008,      
      'name': 'Under 8',
      'footballCoachId': null,
      'hurlingCoachId': null,
    } as IGroup;

    updatedGroupDetails = {
      'id': 2,
      'previousGroupId': 1,
      'yearId': 2,
      'yearOfBirth': 2010,      
      'name': 'Under 6xxx',
      'footballCoachId': 1,
      'hurlingCoachId': 2,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-03-04T10:20:00.000Z',
    };

    groupSummary = {
      'id': 2,
      'yearOfBirth': 2010,      
      'name': 'Under 6',
      'version': '2018-03-04T10:20:00.000Z',
      'footballCoachFullName': 'John Rees',
      'hurlingCoachFullName': 'Byrok Moran',
      'numberOfPlayers': 19,
      'lastUpdatedDate': '2018-07-26T16:29:25.372Z'
    } as IGroupSummary;

    updatedGroupsAfterAdd = [
      {
        'id': 1,
        'yearOfBirth': 2009,      
        'name': 'Under 7',
        'version': '2017-02-04T15:13:00.000Z',
        'footballCoachFullName': 'Angel Klein',
        'hurlingCoachFullName': 'Heddwyn Cunningham',
        'numberOfPlayers': 12,
        'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
      } as IGroupSummary,
      {
        'id': 2,
        'yearOfBirth': 2010,      
        'name': 'Under 6',
        'version': '2018-03-04T10:20:00.000Z',
        'footballCoachFullName': 'John Rees',
        'hurlingCoachFullName': 'Byrok Moran',
        'numberOfPlayers': 19,
        'lastUpdatedDate': '2018-07-26T16:29:25.372Z'
      } as IGroupSummary,
      {
        'id': 3,
        'yearOfBirth': 2011,      
        'name': 'Under 5',
        'version': '2018-06-01T13:20:00.000Z',
        'footballCoachFullName': 'Siward Hansen',
        'hurlingCoachFullName': 'Rowan Love',
        'numberOfPlayers': 21,
        'lastUpdatedDate': '2018-08-02T19:10:25.000Z'
      } as IGroupSummary,
      {
        'id': 4,
        'yearOfBirth': 2008,      
        'name': 'Under 8',
        'version': '2018-06-01T13:20:00.000Z',
        'footballCoachFullName': '',
        'hurlingCoachFullName': '',
        'numberOfPlayers': 0,
        'lastUpdatedDate': null
      } as IGroupSummary
    ];

    updatedGroupsAfterEdit = [
      {
        'id': 1,
        'yearOfBirth': 2009,      
        'name': 'Under 7',
        'version': '2017-02-04T15:13:00.000Z',
        'footballCoachFullName': 'Angel Klein',
        'hurlingCoachFullName': 'Heddwyn Cunningham',
        'numberOfPlayers': 12,
        'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
      } as IGroupSummary,
      {
        'id': 2,
        'yearOfBirth': 2010,      
        'name': 'Under 6xxx',
        'version': '2018-03-04T10:20:00.000Z',
        'footballCoachFullName': 'John Rees',
        'hurlingCoachFullName': 'Byrok Moran',
        'numberOfPlayers': 19,
        'lastUpdatedDate': '2018-07-26T16:29:25.372Z'
      } as IGroupSummary,
      {
        'id': 3,
        'yearOfBirth': 2011,      
        'name': 'Under 5',
        'version': '2018-06-01T13:20:00.000Z',
        'footballCoachFullName': 'Siward Hansen',
        'hurlingCoachFullName': 'Rowan Love',
        'numberOfPlayers': 21,
        'lastUpdatedDate': '2018-08-02T19:10:25.000Z'
      } as IGroupSummary
    ];

    updatedGroupsAfterDelete = [
      {
        'id': 1,
        'yearOfBirth': 2009,      
        'name': 'Under 7',
        'version': '2017-02-04T15:13:00.000Z',
        'footballCoachFullName': 'Angel Klein',
        'hurlingCoachFullName': 'Heddwyn Cunningham',
        'numberOfPlayers': 12,
        'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
      } as IGroupSummary,
      {
        'id': 3,
        'yearOfBirth': 2011,      
        'name': 'Under 5',
        'version': '2018-06-01T13:20:00.000Z',
        'footballCoachFullName': 'Siward Hansen',
        'hurlingCoachFullName': 'Rowan Love',
        'numberOfPlayers': 21,
        'lastUpdatedDate': '2018-08-02T19:10:25.000Z'
      } as IGroupSummary
    ];

    spyOn(coachesService, 'readCoaches')
      .and.returnValue(of({
        'error': null,
        'body': {
          'coaches': [
          ]
        }  
      }));

    spyOn(groupsService, 'readGroupSummaries')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': [
            {
              'id': 1,
              'yearOfBirth': 2009,      
              'name': 'Under 7',
              'version': '2017-02-04T15:13:00.000Z',
              'footballCoachFullName': 'Angel Klein',
              'hurlingCoachFullName': 'Heddwyn Cunningham',
              'numberOfPlayers': 12,
              'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
            },
            {
              'id': 2,
              'yearOfBirth': 2010,      
              'name': 'Under 6',
              'version': '2018-03-04T10:20:00.000Z',
              'footballCoachFullName': 'John Rees',
              'hurlingCoachFullName': 'Byrok Moran',
              'numberOfPlayers': 19,
              'lastUpdatedDate': '2018-07-26T16:29:25.372Z'
            },
            {
              'id': 3,
              'yearOfBirth': 2011,      
              'name': 'Under 5',
              'version': '2018-06-01T13:20:00.000Z',
              'footballCoachFullName': 'Siward Hansen',
              'hurlingCoachFullName': 'Rowan Love',
              'numberOfPlayers': 21,
              'lastUpdatedDate': '2018-08-02T19:10:25.000Z'
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

  it('should call groupsService.readGroupSummaries', () => {
    expect(groupsService.readGroupSummaries).toHaveBeenCalled();
  });

  it('should display total count', () => {
    expect(fixture.nativeElement.querySelector('#total-count').innerHTML).toEqual('Total 3');
  });

  it('should display active count', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#active-count').innerHTML).toEqual('Active 3');
  }));

  it('should display dormant count', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#dormant-count').innerHTML).toEqual('Dormant 1');
  }));

  it('should display add group button', () => {
    expect(fixture.nativeElement.querySelector('#add-group').hidden).toBeFalsy();  
  });

  it('should display first group', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1)')).toBeTruthy();
  });

  it('should display last group', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3)')).toBeTruthy();
  });

  it('should display active group state', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should display dormant group state', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  }));

  it('should display name', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Under 7');
  });

  it('should display year of birth', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(2) > td:nth-child(3)').innerHTML).toEqual('2010');
  });

  it('should display football coach full name', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('Siward Hansen');
  });

  it('should display hurling coach full name', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('Heddwyn Cunningham');
  });

  it('should display number of players', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(2) > td:nth-child(6)').innerHTML).toEqual('19');
  });

  it('should display last updated date', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(7)').innerHTML).toEqual('02/08/2018 7:10 PM');
  });

  it('should not display delete column', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > thead > tr:nth-child(1) > td:nth-child(9)')).toBeNull();
  });

  it('should display delete column', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > thead > tr:nth-child(1) > td:nth-child(9)')).toBeDefined();
  }));

  it('should display edit link', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(8) > a > span').innerHTML).toEqual('Edit');
  });

  it('should not display delete link', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(4) > td:nth-child(9) > span').innerHTML).toEqual('');
  }));

  it('should display delete link', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(9) > a > span').innerHTML).toEqual('Delete');
  }));

  it('should default sort by year of birth (first group)', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('2009');
  });

  it('should default sort by year of birth (last group)', () => {
    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(3)').innerHTML).toEqual('2011');
  });

  it('should sort by status (first group)', () => {
    component.onClickHeader('status');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-success')).toEqual('');
  });

  it('should sort by status (last group)', () => {
    component.onClickHeader('status');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should sort by name (first group)', () => {
    component.onClickHeader('name');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Under 5');
  });

  it('should sort by name (last group)', () => {
    component.onClickHeader('name');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('Under 7');
  });

  it('should sort by year of birth (first group)', () => {
    component.onClickHeader('yearOfBirth');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('2011');
  });

  it('should sort by year of birth (last group)', () => {
    component.onClickHeader('yearOfBirth');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(3)').innerHTML).toEqual('2009');
  });

  it('should sort by football coach full name (first group)', () => {
    component.onClickHeader('footballCoachFullName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(4)').innerHTML).toEqual('Angel Klein');
  });

  it('should sort by football coach full name (last group)', () => {
    component.onClickHeader('footballCoachFullName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('Siward Hansen');
  });

  it('should sort by hurling coach full name (first group)', () => {
    component.onClickHeader('hurlingCoachFullName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('Byrok Moran');
  });

  it('should sort by hurling coach full name (last group)', () => {
    component.onClickHeader('hurlingCoachFullName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(5)').innerHTML).toEqual('Rowan Love');
  });

  it('should sort by number of players (first group)', () => {
    component.onClickHeader('numberOfPlayers');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML).toEqual('12');
  });

  it('should sort by number of players (last group)', () => {
    component.onClickHeader('numberOfPlayers');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(6)').innerHTML).toEqual('21');
  });

  it('should sort by last updated date (first group)', () => {
    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(7)').innerHTML).toEqual('04/02/2018 12:00 AM');
  });

  it('should sort by last updated date (last group)', () => {
    component.onClickHeader('lastUpdatedDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(7)').innerHTML).toEqual('02/08/2018 7:10 PM');
  });

  it('should flip existing sort (first group)', () => {
    component.onClickHeader('hurlingCoachFullName');

    fixture.detectChanges();

    component.onClickHeader('hurlingCoachFullName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('Rowan Love');
  });

  it('should flip existing sort (last group)', () => {
    component.onClickHeader('numberOfPlayers');

    fixture.detectChanges();

    component.onClickHeader('numberOfPlayers');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(3) > td:nth-child(6)').innerHTML).toEqual('12');
  });

  it('should filter on group name', () => {
    component.filterForm.controls['nameFilter'].setValue('Under 7');

    fixture.detectChanges();

    component.filterGroups(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#groups-table > tbody > tr').length).toEqual(1);
  });

  it('should display filter message', () => {
    component.filterForm.controls['nameFilter'].setValue('5');

    fixture.detectChanges();

    component.filterGroups(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 1 Groups');
  });

  it('should call groupsService.readGroupDetails when a group is selected', () => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow(groupSummary);

    expect(groupsService.readGroupDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when a group is selected', () => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow(groupSummary);

    expect(modalService.open).toHaveBeenCalledWith(GroupPopupComponent);
  });

  it('should call NgbModal.open when add group is selected', () => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    expect(modalService.open).toHaveBeenCalledWith(GroupFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully added group popup', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Group Successfully Added', 'Under 8');
  }));

  it('should display groups after adding a group', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: newGroupDetails,
          updatedGroups: updatedGroupsAfterAdd
        })
      });

    component.onClickAddGroup();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Under 8');
  }));

  it('should call groupsService.readGroupDetails when edit group is selected', () => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: updatedGroupDetails,
          updatedGroups: updatedGroupsAfterEdit
        })
      });

    component.onClickEditGroup(new MouseEvent('click'), groupSummary);

    expect(groupsService.readGroupDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when edit group is selected', () => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

      spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: groupDetails,
          updatedGroups: updatedGroupsAfterEdit
        })
      });

    component.onClickEditGroup(new MouseEvent('click'), groupSummary);

    expect(modalService.open).toHaveBeenCalledWith(GroupFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully updated group popup', fakeAsync(() => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: updatedGroupDetails,
          updatedGroups: updatedGroupsAfterEdit
        })
      });

    component.onClickEditGroup(new MouseEvent('click'), groupSummary);
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Group Successfully Updated', 'Under 6xxx');
  }));

  it('should display groups after updating a group', fakeAsync(() => {
    spyOn(groupsService, 'readGroupDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groupDetails': groupDetails
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          groupDetails: updatedGroupDetails,
          updatedGroups: updatedGroupsAfterEdit
        })
      });

    component.onClickEditGroup(new MouseEvent('click'), groupSummary);
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(2) > td:nth-child(2)').innerHTML).toEqual('Under 6xxx');
  }));

  it('should call NgbModal.open when delete group is selected', () => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedGroups: updatedGroupsAfterDelete
        })
      });

    component.onClickDeleteGroup(new MouseEvent('click'), groupSummary);

    expect(modalService.open).toHaveBeenCalledWith(ConfirmDeleteGroupComponent, { backdrop: 'static' });
  });

  it('should display successfully deleted group popup', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedGroups: updatedGroupsAfterDelete
        })
      });

    component.onClickDeleteGroup(new MouseEvent('click'), groupSummary);
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Group Successfully Deleted', 'Under 6');
  }));

  it('should display groups after deleting a group', fakeAsync(() => {
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          updatedGroups: updatedGroupsAfterDelete
        })
      });

    component.onClickDeleteGroup(new MouseEvent('click'), groupSummary);

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Under 7');
  }));

  it('should download CSV of current filter', () => {
    spyOn(groupsService, 'downloadCSV')

    component.filterForm.controls['nameFilter'].setValue('Under 6');

    fixture.detectChanges();

    component.filterGroups(component.filterForm.value);

    fixture.detectChanges();

    component.onClickDownloadCSV();

    expect(groupsService.downloadCSV).toHaveBeenCalledWith([
      {
        'name': 'Under 6',
        'yearOfBirth': 2010,      
        'footballCoach': 'John Rees',
        'hurlingCoach': 'Byrok Moran',
        'numberOfPlayers': 19,
        'lastUpdatedDate': '2018-07-26'
      }
    ]);
  });
});
