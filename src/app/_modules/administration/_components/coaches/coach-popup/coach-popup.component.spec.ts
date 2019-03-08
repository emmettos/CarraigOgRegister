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

    component['coachDetails'] = {
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

    component['coachGroups'] = [
      {
        'groupName': 'Under 9',
        'role': 'Hurling Coach'
      }
    ];

    component['active'] = true;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set header style for active coach state', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for dormant coach state', () => {
    component['coachGroups'] = null;

    component['active'] = false;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should display name', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#name").innerHTML).toEqual('Erick Norris');
  });

  it('should display email address', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#email-address").innerHTML).toEqual('erick_norris@carraigog.com');
  });

  it('should display phone number', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#phone-number").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Phone Number:</strong> 086 6095372');
  });

  it('should display not administrator status', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administrator-status").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Administrator:</strong> NO');
  });

  it('should display administrator status', () => {
    component.coachDetails.administrator = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#administrator-status").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Administrator:</strong> YES');
  });

  it('should display No Current Groups', () => {
    component['coachGroups'] = null;

    component['active'] = false;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#no-current-groups").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">No Current Groups</strong>');
  });

  it('should display group name', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coach-groups-table > tbody > tr:nth-child(1) > td:nth-child(1)').innerHTML).toEqual('Under 9');
  });

  it('should display group role', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#coach-groups-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Hurling Coach');
  });

  it('should set footer style for active coach state', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set footer style for dormant coach state', () => {
    component['coachGroups'] = null;

    component['active'] = false;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should display created date', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-date").innerHTML).toEqual('Created Date: 15/03/2017 1:43 PM');
  });

  it('should display created by', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-by").innerHTML).toEqual('Created By: script');
  });

  it('should display updated date', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-date").innerHTML).toEqual('Updated Date: 13/02/2018 10:21 AM');
  });

  it('should display updated by', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-by").innerHTML).toEqual('Updated By: admin@carraigog.com');
  });
});
