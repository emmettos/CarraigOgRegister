import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { CoachPopupComponent } from './coach-popup.component';


describe('CoachPopupComponent', () => {
  let component: CoachPopupComponent;
  let fixture: ComponentFixture<CoachPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CoachPopupComponent 
      ],
      imports: [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set header style for active coach state', () => {
    component.coachDetails = {
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
      'active': true,
      'currentSessionOwner': false
    };
    component.coachGroups = [{
      'groupName': 'Under 9',
      'role': 'Hurling Manager'
    }]

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for dormant coach state', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should display name', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#name").innerHTML).toEqual('Lachlan Johnson');
  });

  it('should display email address', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#email-address").innerHTML).toEqual('lachlan_johnson@carraigog.com');
  });

  it('should display phone number', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#phone-number").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Phone Number:</strong> 086 4449465');
  });

  it('should display not administrator status', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administrator-status").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Administrator:</strong> NO');
  });

  it('should display administrator status', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': true
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administrator-status").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Administrator:</strong> YES');
  });

  it('should display No Current Groups', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#no-current-groups").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">No Current Groups</strong>');
  });

  it('should display group name', () => {
    component.coachDetails = {
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
      'active': true,
      'currentSessionOwner': false
    };
    component.coachGroups = [{
      'groupName': 'Under 9',
      'role': 'Hurling Manager'
    }]

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coach-groups-table > tbody > tr:nth-child(1) > td:nth-child(1)').innerHTML).toEqual('Under 9');
  });

  it('should display group role', () => {
    component.coachDetails = {
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
      'active': true,
      'currentSessionOwner': false
    };
    component.coachGroups = [{
      'groupName': 'Under 9',
      'role': 'Hurling Manager'
    }]

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coach-groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Hurling Manager');
  });

  it('should set footer style for active coach state', () => {
    component.coachDetails = {
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
      'active': true,
      'currentSessionOwner': false
    };
    component.coachGroups = [{
      'groupName': 'Under 9',
      'role': 'Hurling Manager'
    }]

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set footer style for dormant coach state', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should display created date', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-date").innerHTML).toEqual('Created Date: 15/03/2017 1:43 PM');
  });

  it('should display created by', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-by").innerHTML).toEqual('Created By: script');
  });

  it('should display updated date', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-date").innerHTML).toEqual('Updated Date: 09/05/2018 9:55 AM');
  });

  it('should display updated by', () => {
    component.coachDetails = {
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
      'active': false,
      'currentSessionOwner': false
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-by").innerHTML).toEqual('Updated By: administrator@carraigog.com');
  });
});
