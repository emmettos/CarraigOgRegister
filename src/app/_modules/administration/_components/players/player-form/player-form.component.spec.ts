import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import * as moment from 'moment';

import { APP_SETTINGS } from '../../../../../_helpers/index';
import { IPlayer, PlayerState, IGroupPlayer, IGroup } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { PlayerFormComponent } from './player-form.component';


describe('PlayerFormComponent', () => {
  let component: PlayerFormComponent;
  let fixture: ComponentFixture<PlayerFormComponent>;

  let playersService: PlayersService,
      activeModal: NgbActiveModal;

  let playerDetails: IPlayer,
      groupPlayerDetails: IGroupPlayer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PlayerFormComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        PlayersService,
        ValidationService,
        NgbActiveModal
      ],
      schemas: [ 
        NO_ERRORS_SCHEMA 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerFormComponent);
    component = fixture.componentInstance;

    APP_SETTINGS.currentYear = 2019;

    playersService = TestBed.get(PlayersService);
    activeModal = TestBed.get(NgbActiveModal);

    playerDetails = {
      'id': 2,
      'firstName': 'Matthew',
      'surname': 'Moss',
      'addressLine1': '179 Payne Street',
      'addressLine2': 'Clear Mount',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2010-03-03',
      'medicalConditions': '',
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

    groupPlayerDetails = {
      'id': 1,
      'groupId': 1,
      'playerId': 1,
      'registeredDate': '2019-01-31 00:00:00',
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'updatedDate': '2018-02-13T10:17:21.332Z',
      'version': '2018-02-13T10:17:21.332Z'
    };

    component['groups'] = [
      {
        'id': 3,
        'previousGroupId': 2,
        'yearId': 1,
        'name': 'Under 8',
        'yearOfBirth': 2010,
        'footballCoachId': 5,
        'hurlingCoachId': 6,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'version': '2018-02-27T15:57:21.582Z'
      },
      {
        'id': 2,
        'previousGroupId': 1,
        'yearId': 1,
        'name': 'Under 9',
        'yearOfBirth': 2009,
        'footballCoachId': 3,
        'hurlingCoachId': 4,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'version': '2018-02-27T15:57:21.582Z'
      },
      {
        'id': 1,
        'yearId': 1,
        'name': 'Under 10',
        'yearOfBirth': 2008,
        'footballCoachId': 1,
        'hurlingCoachId': 2,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'version': '2018-02-27T15:57:21.582Z'
      } as IGroup
    ];
  });

  it('should create', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize add new player title', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Add New Player');
  });

  it('should initialize edit player title', () => {
    component['playerDetails'] = playerDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Edit Player');
  });

  it('should set header style for existing player state', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-info')).toEqual('');
  });

  it('should set header style for new player state', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for missing player state', () => {
    component['playerDetails'] = playerDetails;
    component['playerState'] = PlayerState.Missing;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should set header style for gone player state', () => {
    component['playerDetails'] = playerDetails;
    component['playerState'] = PlayerState.Gone;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-danger')).toEqual('');
  });

  it('should set date of birth picker min date', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.dateOfBirthPicker.minDate).toEqual({ year: 2007, month: 1, day: 1 });
  });

  it('should set date of birth picker max date', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.dateOfBirthPicker.maxDate).toEqual({ year: 2010, month: 12, day: 31 });
  });

  it('should set registered date picker min date', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.registeredDatePicker.minDate).toEqual({ year: 2018, month: 1, day: 1 });
  });

  it('should set registered date picker max date', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.registeredDatePicker.maxDate).toEqual({ year: 2020, month: 12, day: 31 });
  });

  it('should set unregistered player registered date picker start date', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.registeredDatePicker.startDate).toEqual({ year: 2019, month: 6 });
  });

  it('should initialize groups option 1', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('#group-select').options[0].text).toEqual('Not Registered');  
  });

  it('should initialize groups value option 1', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#group-select').options[0].value).toEqual('0');  
  });

  it('should initialize groups option 3', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#group-select').options[2].text).toEqual('Under 9');  
  });

  it('should initialize groups value option 2', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#group-select').options[1].value).toEqual('1: 3');  
  });

  it('should initialize new player first name field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['firstName'].value).toEqual('');
  });

  it('should initialize edit player first name field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['firstName'].value).toEqual('Matthew');
  });

  it('should initialize new player surname field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['surname'].value).toEqual('');
  });

  it('should initialize edit player surname field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['surname'].value).toEqual('Moss');
  });

  it('should initialize new player address line 1 field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine1'].value).toEqual('');
  });

  it('should initialize edit player addres line 1 field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine1'].value).toEqual('179 Payne Street');
  });

  it('should initialize new player address line 2 field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine2'].value).toEqual('');
  });

  it('should initialize edit player addres line 2 field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine2'].value).toEqual('Clear Mount');
  });

  it('should initialize new player address line 3 field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine3'].value).toEqual('');
  });

  it('should initialize edit player addres line 3 field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['addressLine3'].value).toEqual('Carrigaline');
  });

  it('should initialize new player medical conditions field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['medicalConditions'].value).toEqual('');
  });

  it('should initialize edit player medical conditions field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['medicalConditions'].value).toEqual('');
  });

  it('should initialize new player date of birth field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['dateOfBirth'].value).toEqual({ year: 2009, month: 10, day: 13 });
  });

  it('should initialize edit player date of birth field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['dateOfBirth'].value).toEqual({ year: 2010, month: 3, day: 3 });
  });

  it('should initialize new player registered date field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].value).toEqual('');
  });

  it('should initialize edit player registered date field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].value).toEqual({ year: 2019, month: 1, day: 31 });
  });

  it('should initialize new player group field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#group-select').value).toEqual('0');  
  });

  it('should initialize edit player group field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#group-select').value).toEqual('3: 1');  
  });

  it('should initialize new player school field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['school'].value).toEqual('');
  });

  it('should initialize edit player school field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['school'].value).toEqual('Scoil Mhuire Lourdes');
  });

  it('should initialize new player contact name field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['contactName'].value).toEqual('');
  });

  it('should initialize edit player contact name field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['contactName'].value).toEqual('Wilder Moss');
  });

  it('should initialize new player contact email address field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['contactEmailAddress'].value).toEqual('');
  });

  it('should initialize edit player contact email address field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['contactEmailAddress'].value).toEqual('wilder_moss@gmail.com');
  });

  it('should initialize new player contact mobile number field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['contactMobileNumber'].value).toEqual('');
  });

  it('should initialize edit player contact mobile number field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['contactMobileNumber'].value).toEqual('087 6186779');
  });

  it('should initialize new player contact home number field', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(component.playerForm.controls['contactHomeNumber'].value).toEqual('');
  });

  it('should initialize edit player contact home number field', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    expect(component.playerForm.controls['contactHomeNumber'].value).toEqual('029 400 1122');
  });

  it('should update form value in new player mode', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['addressLine1'].setValue('Address Line 1');
    component.playerForm.controls['addressLine2'].setValue('Address Line 2');
    component.playerForm.controls['addressLine3'].setValue('Address Line 3');
    component.playerForm.controls['medicalConditions'].setValue('Asthma');
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['school'].setValue('Scoil Mhuire Lourdes');
    component.playerForm.controls['contactName'].setValue('Test Contact');
    component.playerForm.controls['contactEmailAddress'].setValue('test_contact@gmail.com');
    component.playerForm.controls['contactMobileNumber'].setValue('087 1234567');
    component.playerForm.controls['contactHomeNumber'].setValue('021 7654321');

    expect(component.playerForm.value).toEqual({
      firstName: 'Test',
      surname: 'User',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      addressLine3: 'Address Line 3',
      medicalConditions: 'Asthma',
      registeredDate: { year: 2019, month: 2, day: 13 },
      playerGroup: 2,
      school: 'Scoil Mhuire Lourdes',
      contactName: 'Test Contact',
      contactEmailAddress: 'test_contact@gmail.com',
      contactMobileNumber: '087 1234567',
      contactHomeNumber: '021 7654321'
    });
  });

  it('should update form value in edit player mode', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['addressLine1'].setValue('Address Line 1');
    component.playerForm.controls['addressLine2'].setValue('Address Line 2');
    component.playerForm.controls['addressLine3'].setValue('Address Line 3');
    component.playerForm.controls['medicalConditions'].setValue('Asthma');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['school'].setValue('Scoil Mhuire Lourdes');
    component.playerForm.controls['contactName'].setValue('Test Contact');
    component.playerForm.controls['contactEmailAddress'].setValue('test_contact@gmail.com');
    component.playerForm.controls['contactMobileNumber'].setValue('087 1234567');
    component.playerForm.controls['contactHomeNumber'].setValue('021 7654321');

    expect(component.playerForm.value).toEqual({
      firstName: 'Test',
      surname: 'User',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      addressLine3: 'Address Line 3',
      medicalConditions: 'Asthma',
      dateOfBirth: { year: 2009, month: 10, day: 13 },
      registeredDate: { year: 2019, month: 2, day: 13 },
      playerGroup: 2,
      school: 'Scoil Mhuire Lourdes',
      contactName: 'Test Contact',
      contactEmailAddress: 'test_contact@gmail.com',
      contactMobileNumber: '087 1234567',
      contactHomeNumber: '021 7654321'
    });
  });

  it('should validate invalid first name', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('');
    
    expect(component.playerForm.controls['firstName'].invalid).toBeTruthy();
  });

  it('should validate valid first name', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    
    expect(component.playerForm.controls['firstName'].invalid).toBeFalsy();
  });

  it('should validate invalid surname', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['surname'].setValue('');
    
    expect(component.playerForm.controls['surname'].invalid).toBeTruthy();
  });

  it('should validate valid surname', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['surname'].setValue('Player');
    
    expect(component.playerForm.controls['surname'].invalid).toBeFalsy();
  });

  it('should validate existing player empty date of birth', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['dateOfBirth'].setValue('');

    expect(component.playerForm.controls['dateOfBirth'].invalid).toBeTruthy();
  });

  it('should validate existing player invalid date of birth', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['dateOfBirth'].setValue('ddd');

    expect(component.playerForm.controls['dateOfBirth'].invalid).toBeTruthy();
  });

  it('should validate existing player valid date of birth', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });

    expect(component.playerForm.controls['dateOfBirth'].invalid).toBeFalsy();
  });

  it('should validate new player empty registered date', () => {
    component['dateOfBirth'] = moment.utc('2019-10-13');

    fixture.detectChanges();

    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  });

  it('should validate new player invalid registered date', () => {
    component['dateOfBirth'] = moment.utc('2019-10-13');

    fixture.detectChanges();

    component.playerForm.controls['registeredDate'].setValue('ddd');

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  });

  it('should validate new player outside range registered date', () => {
    component['dateOfBirth'] = moment.utc('2019-10-13');

    fixture.detectChanges();
    
    component.playerForm.controls['registeredDate'].setValue({ year: 2015, month: 2, day: 13 });

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  });

  it('should validate new player valid registered date', () => {
    component['dateOfBirth'] = moment.utc('2019-10-13');

    fixture.detectChanges();

    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  });

  it('should validate existing player empty registered date', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  }));

  it('should validate existing player empty registered date after selecting group', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue(1);

    component.onGroupChange(1);

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  }));

  it('should validate existing player empty registered date after selecting no group', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    component.onRegisteredDateChange();

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue('0');

    component.onGroupChange('0');

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  }));

  it('should validate existing player invalid registered date', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue('ddd');

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  }));

  it('should validate existing player outside range registered date', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue({ year: 2015, month: 2, day: 13 });

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  }));

  it('should validate existing player valid registered date', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();

    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  }));

  it('should validate existing player empty registered date', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  }));

  it('should validate existing player empty registered date after selecting group', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue(1);

    component.onGroupChange(1);

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeTruthy();
  }));

  it('should validate existing player empty registered date after selecting no group', fakeAsync(() => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    tick();
    
    component.playerForm.controls['registeredDate'].setValue(null);

    component.onRegisteredDateChange();

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue('0');

    component.onGroupChange('0');

    fixture.detectChanges();

    expect(component.playerForm.controls['registeredDate'].invalid).toBeFalsy();
  }));

  it('should validate invalid group', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue('0');
    
    expect(component.playerForm.controls['playerGroup'].invalid).toBeTruthy();
  });

  it('should validate valid group', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['playerGroup'].setValue(2);
    
    expect(component.playerForm.controls['playerGroup'].invalid).toBeFalsy();
  });

  it('should disable submit button for invalid form', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy()  
  });

  it('should read first name when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.firstName).toEqual('Test');
  });

  it('should read surname when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.surname).toEqual('User');
  });

  it('should read address line 1 when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['addressLine1'].setValue('Address Line 1');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.addressLine1).toEqual('Address Line 1');
  });

  it('should read address line 2 when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['addressLine2'].setValue('Address Line 2');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.addressLine2).toEqual('Address Line 2');
  });

  it('should read address line 3 when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['addressLine3'].setValue('Address Line 3');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.addressLine3).toEqual('Address Line 3');
  });

  it('should read date of birth when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.dateOfBirth).toEqual('2009-10-13');
  });

  it('should read registered date when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.groupPlayerDetails.registeredDate).toEqual('2019-02-13');
  });

  it('should read group when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.groupPlayerDetails.groupId).toEqual(2);
  });

  it('should read medical conditions when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['medicalConditions'].setValue('Asthma');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.medicalConditions).toEqual('Asthma');
  });

  it('should read school when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['school'].setValue('Scoil Mhuire Lourdes');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.school).toEqual('Scoil Mhuire Lourdes');
  });

  it('should read contact name when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['contactName'].setValue('Contact');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.contactName).toEqual('Contact');
  });

  it('should read contact email address when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['contactEmailAddress'].setValue('contact_name@gmail.com');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.contactEmailAddress).toEqual('contact_name@gmail.com');
  });

  it('should read contact mobile number when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['contactMobileNumber'].setValue('087 1234567');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.contactMobileNumber).toEqual('087 1234567');
  });

  it('should read contact home number when saving a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });
    component.playerForm.controls['contactHomeNumber'].setValue('021 7654321');

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(component.playerDetails.contactHomeNumber).toEqual('021 7654321');
  });

  it('should call playersService.updatePlayer when updating a player', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    spyOn(playersService, 'updatePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(playersService.updatePlayer).toHaveBeenCalledWith(playerDetails, groupPlayerDetails);
  });

  it('should call playersService.createPlayer when creating a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }));

    component.onSubmit(component.playerForm.value);

    expect(playersService.createPlayer).toHaveBeenCalledWith({
      'firstName': 'Test',
      'surname': 'User',
      'addressLine1': '',
      'addressLine2': '',
      'addressLine3': '',
      'dateOfBirth': '2009-10-13',
      'school': '',
      'medicalConditions': '',
      'contactName': '',
      'contactEmailAddress': '',
      'contactMobileNumber': '',
      'contactHomeNumber': ''
    }, {
      'registeredDate': '2019-02-13',
      'groupId': 2
    });
  });

  it('should call activeModal.close after successfully creating a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: [
            {
              'id': 1,
              'firstName': 'Michael',
              'surname': 'Wolfe',
              'addressLine1': '830 Green Gate Lane',
              'addressLine2': 'Carrigaline',
              'addressLine3': '',
              'dateOfBirth': '2010-03-03',
              'medicalConditions': 'Asthma',
              'contactName': 'Moss Wolfe',
              'contactMobileNumber': '087 7128560',
              'contactHomeNumber': '021 9292476',
              'contactEmailAddress': 'moss_wolfe@gmail.com',
              'school': 'Scoil Mhuire Lourdes',
              'version': '2018-02-04T15:13:00.000Z',
              'lastRegisteredDate': '2018-02-04',
              'playerState': 1
            },
            {
              'id': 2,
              'firstName': 'Matthew',
              'surname': 'Moss',
              'addressLine1': '179 Payne Street',
              'addressLine2': 'Clear Mount',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2010-03-03',
              'medicalConditions': '',
              'contactName': 'Wilder Moss',
              'contactMobileNumber': '087 6186779',
              'contactHomeNumber': '',
              'contactEmailAddress': 'wilder_moss@gmail.com',
              'school': '',
              'version': '2018-02-04T15:13:00.000Z',
              'lastRegisteredDate': '2018-02-04',
              'playerState': 0
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.playerForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      playerDetails: { 
        'firstName': 'Test',
        'surname': 'User',
        'addressLine1': '',
        'addressLine2': '',
        'addressLine3': '',
        'dateOfBirth': '2009-10-13',
        'school': '',
        'medicalConditions': '',
        'contactName': '',
        'contactEmailAddress': '',
        'contactMobileNumber': '',
        'contactHomeNumber': ''
      },
      matchedPlayers: [
        {
          'id': 1,
          'firstName': 'Michael',
          'surname': 'Wolfe',
          'addressLine1': '830 Green Gate Lane',
          'addressLine2': 'Carrigaline',
          'addressLine3': '',
          'dateOfBirth': '2010-03-03',
          'medicalConditions': 'Asthma',
          'contactName': 'Moss Wolfe',
          'contactMobileNumber': '087 7128560',
          'contactHomeNumber': '021 9292476',
          'contactEmailAddress': 'moss_wolfe@gmail.com',
          'school': 'Scoil Mhuire Lourdes',
          'version': '2018-02-04T15:13:00.000Z',
          'lastRegisteredDate': '2018-02-04',
          'playerState': 1
        },
        {
          'id': 2,
          'firstName': 'Matthew',
          'surname': 'Moss',
          'addressLine1': '179 Payne Street',
          'addressLine2': 'Clear Mount',
          'addressLine3': 'Carrigaline',
          'dateOfBirth': '2010-03-03',
          'medicalConditions': '',
          'contactName': 'Wilder Moss',
          'contactMobileNumber': '087 6186779',
          'contactHomeNumber': '',
          'contactEmailAddress': 'wilder_moss@gmail.com',
          'school': '',
          'version': '2018-02-04T15:13:00.000Z',
          'lastRegisteredDate': '2018-02-04',
          'playerState': 0
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to create a player', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService , 'createPlayer')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.playerForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should call activeModal.close after successfully editing a player', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('XXX');

    fixture.detectChanges();

    spyOn(playersService, 'updatePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: [
            {
              'id': 1,
              'firstName': 'Michael',
              'surname': 'Wolfe',
              'addressLine1': '830 Green Gate Lane',
              'addressLine2': 'Carrigaline',
              'addressLine3': '',
              'dateOfBirth': '2010-03-03',
              'medicalConditions': 'Asthma',
              'contactName': 'Moss Wolfe',
              'contactMobileNumber': '087 7128560',
              'contactHomeNumber': '021 9292476',
              'contactEmailAddress': 'moss_wolfe@gmail.com',
              'school': 'Scoil Mhuire Lourdes',
              'version': '2018-02-04T15:13:00.000Z',
              'lastRegisteredDate': '2018-02-04',
              'playerState': 1
            },
            {
              'id': 2,
              'firstName': 'Matthew',
              'surname': 'Moss',
              'addressLine1': '179 Payne Street',
              'addressLine2': 'Clear Mount',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2010-03-03',
              'medicalConditions': '',
              'contactName': 'Wilder Moss',
              'contactMobileNumber': '087 6186779',
              'contactHomeNumber': '',
              'contactEmailAddress': 'wilder_moss@gmail.com',
              'school': '',
              'version': '2018-02-04T15:13:00.000Z',
              'lastRegisteredDate': '2018-02-04',
              'playerState': 0
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.playerForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      playerDetails: { 
        'id': 2,
        'firstName': 'XXX',
        'surname': 'Moss',
        'addressLine1': '179 Payne Street',
        'addressLine2': 'Clear Mount',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2010-03-03',
        'medicalConditions': '',
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
        },
      matchedPlayers: [
        {
          'id': 1,
          'firstName': 'Michael',
          'surname': 'Wolfe',
          'addressLine1': '830 Green Gate Lane',
          'addressLine2': 'Carrigaline',
          'addressLine3': '',
          'dateOfBirth': '2010-03-03',
          'medicalConditions': 'Asthma',
          'contactName': 'Moss Wolfe',
          'contactMobileNumber': '087 7128560',
          'contactHomeNumber': '021 9292476',
          'contactEmailAddress': 'moss_wolfe@gmail.com',
          'school': 'Scoil Mhuire Lourdes',
          'version': '2018-02-04T15:13:00.000Z',
          'lastRegisteredDate': '2018-02-04',
          'playerState': 1
        },
        {
          'id': 2,
          'firstName': 'Matthew',
          'surname': 'Moss',
          'addressLine1': '179 Payne Street',
          'addressLine2': 'Clear Mount',
          'addressLine3': 'Carrigaline',
          'dateOfBirth': '2010-03-03',
          'medicalConditions': '',
          'contactName': 'Wilder Moss',
          'contactMobileNumber': '087 6186779',
          'contactHomeNumber': '',
          'contactEmailAddress': 'wilder_moss@gmail.com',
          'school': '',
          'version': '2018-02-04T15:13:00.000Z',
          'lastRegisteredDate': '2018-02-04',
          'playerState': 0
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to edit a player', () => {
    component['playerDetails'] = playerDetails;
    component['groupPlayerDetails'] = groupPlayerDetails;
    component['playerState'] = PlayerState.Existing;

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('XXX');

    fixture.detectChanges();

    spyOn(playersService , 'updatePlayer')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');

    component.onSubmit(component.playerForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should disable first name field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#first-name').disabled).toBeTruthy();  
  });

  it('should disable surname field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#surname').disabled).toBeTruthy();  
  });

  it('should disable address line 1 field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#address-line1').disabled).toBeTruthy();  
  });

  it('should disable address line 2 field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#address-line2').disabled).toBeTruthy();  
  });

  it('should disable address line 3 field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#address-line3').disabled).toBeTruthy();  
  });

  it('should disable date of birth field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#date-of-birth').disabled).toBeTruthy();  
  });

  it('should disable registered date field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#registered-date').disabled).toBeTruthy();  
  });

  it('should disable player group field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#group-select').disabled).toBeTruthy();  
  });

  it('should disable medical conditions field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#medical-conditions').disabled).toBeTruthy();  
  });

  it('should disable school field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#school').disabled).toBeTruthy();  
  });

  it('should disable contact name field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeTruthy();  
  });

  it('should disable contact email address field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeTruthy();  
  });

  it('should disable contact mobile number field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeTruthy();  
  });

  it('should disable contact home number field after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();
    
    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeTruthy();  
  });

  it('should disable cancel button after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable save button after submitting a player to be saved', () => {
    component['dateOfBirth'] = moment.utc('2009-10-13');

    fixture.detectChanges();

    component.playerForm.controls['firstName'].setValue('Test');
    component.playerForm.controls['surname'].setValue('User');
    component.playerForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });
    component.playerForm.controls['playerGroup'].setValue(2);
    component.playerForm.controls['registeredDate'].setValue({ year: 2019, month: 2, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: []
        }
      }, asyncScheduler));

    component.onSubmit(component.playerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
