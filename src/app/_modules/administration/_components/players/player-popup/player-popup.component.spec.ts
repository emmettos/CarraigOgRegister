import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { IPlayer, PlayerState } from '../../../../../_models/index';
import { PlayerPopupComponent } from './player-popup.component';


describe('PlayerPopupComponent', () => {
  let component: PlayerPopupComponent;
  let fixture: ComponentFixture<PlayerPopupComponent>;

  let playerDetails: IPlayer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PlayerPopupComponent 
      ],
      imports: [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPopupComponent);
    component = fixture.componentInstance;

    playerDetails = {
      'id': 2,
      'firstName': 'Matthew',
      'surname': 'Moss',
      'addressLine1': '179 Payne Street',
      'addressLine2': 'Clear Mount',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2010-03-03',
      'medicalConditions': 'Heart Murmur',
      'contactName': 'Wilder Moss',
      'contactMobileNumber': '087 6186779',
      'contactHomeNumber': '029 400 1122',
      'contactEmailAddress': 'wilder_moss@gmail.com',
      'school': 'Scoil Mhuire Lourdes',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-02-13T10:21:40.545Z'
    };
  });

  it('should create', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Existing;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set header style for existing player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Existing;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-info')).toEqual('');
  });

  it('should set header style for new player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for missing player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Missing;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should set header style for gone player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-danger')).toEqual('');
  });

  it('should display name', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#name").innerHTML).toEqual('Matthew Moss');
  });

  it('should display address line 1', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#address-line1").innerHTML).toEqual('179 Payne Street');
  });

  it('should display address line 2', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#address-line2").innerHTML).toEqual('Clear Mount');
  });

  it('should display address line 3', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#address-line3").innerHTML).toEqual('Carrigaline');
  });

  it('should display group name', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#group-name").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Group:</strong> Under 9');
  });

  it('should display date of birth', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#date-of-birth").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Date of Birth:</strong> 03/03/2010');
  });

  it('should display medical conditions', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#medical-conditions").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Medical Conditions:</strong> Heart Murmur');
  });

  it('should display contact name', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#contact-name").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Contact Name:</strong> Wilder Moss');
  });

  it('should display contact email address', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#contact-email-address").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Contact Email:</strong> wilder_moss@gmail.com');
  });

  it('should display contact mobile number', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#contact-mobile-number").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Contact Mobile:</strong> 087 6186779');
  });

  it('should display contact home number', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#contact-home-number").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Contact Phone:</strong> 029 400 1122');
  });

  it('should display school', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#school").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">School:</strong> Scoil Mhuire Lourdes');
  });

  it('should set footer style for existing player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Existing;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-info-light')).toEqual('');
  });

  it('should set footer style for new player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-success-light')).toEqual('');
  });

  it('should set footer style for missing player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Missing;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-warning-light')).toEqual('');
  });

  it('should set footer style for gone player state', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.Gone;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-danger-light')).toEqual('');
  });

  it('should display created by', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-by").innerHTML).toEqual('Created By: script');
  });

  it('should display created date', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-date").innerHTML).toEqual('Created Date: 15/03/2017 1:43 PM');
  });

  it('should display updated by', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-by").innerHTML).toEqual('Updated By: admin@carraigog.com');
  });

  it('should display updated date', () => {
    component.playerDetails = playerDetails;
    component.playerState = PlayerState.New;
    component.groupName = 'Under 9';
    component.lastRegisteredDate = '2019-02-15';

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-date").innerHTML).toEqual('Updated Date: 13/02/2018 10:21 AM');
  });
});
