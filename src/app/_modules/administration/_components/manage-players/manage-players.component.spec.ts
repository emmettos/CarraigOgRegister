import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { APP_SETTINGS } from '../../../../_helpers/index';

import { IPlayer } from '../../../../_models/index';
import { PlayersService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { MockDatePickerComponent } from '../../../../_modules/shared/_components/_mocks/mock-date-picker/mock-date-picker.component.spec';
import { ManagePlayersComponent } from './manage-players.component';


class MockHttpClient {}

describe('ManagePlayersComponent', () => {
  let component: ManagePlayersComponent;
  let fixture: ComponentFixture<ManagePlayersComponent>;

  let playersService: PlayersService;

  let players: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MockDatePickerComponent,
        ManagePlayersComponent 
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        PlayersService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlayersComponent);
    component = fixture.componentInstance;

    APP_SETTINGS.currentYear = 2018;
    APP_SETTINGS.groupYears = [ 2008, 2009, 2010, 2011, 2012, 2013 ];

    playersService = TestBed.get(PlayersService);

    players = [
      {
        "_id": "58c669deb8a0ebcf9c5b93c9",
        "firstName": "Jos",
        "surname": "Keating",
        "addressLine1": "Leela Hill House",
        "addressLine2": "KnockNaLurgan",
        "addressLine3": "Carrigaline",
        "dateOfBirth": "2009-01-01T00:00:00.000Z",
        "yearOfBirth": 2009,
        "medicalConditions": "",
        "contactName": "David Keating",
        "contactMobileNumber": "087 6874814",
        "contactHomeNumber": "",
        "contactEmailAddress": "keatingdavidj@gmail.com",
        "school": "",
        "lastRegisteredDate": "2017-05-08T00:00:00.000Z",
        "lastRegisteredYear": 2017,
        "registeredYears": [
            2016,
            2017
        ],
        "__v": 1,
        "createdBy": "script",
        "createdDate": "2017-03-15T13:43:51.268Z",
        "updatedDate": "2017-05-09T09:55:59.735Z",
        "updatedBy": "emmett.j.osullivan@gmail.com"
      },
      {
        "_id": "58c669deb8a0ebcf9c5b93cb",
        "firstName": "Charlie",
        "surname": "Kennedy",
        "addressLine1": "7 The Orchard",
        "addressLine2": "Herons Wood",
        "addressLine3": "Carrigaline",
        "dateOfBirth": "2009-01-01T00:00:00.000Z",
        "yearOfBirth": 2009,
        "medicalConditions": "",
        "contactName": "Shane Kennedy",
        "contactMobileNumber": "086 8104453",
        "contactHomeNumber": "021 4834511",
        "contactEmailAddress": "shanekennedy7@gmail.com",
        "school": "",
        "lastRegisteredDate": "2018-02-17T00:00:00.000Z",
        "lastRegisteredYear": 2018,
        "registeredYears": [
            2016,
            2017,
            2018
        ],
        "__v": 2,
        "createdBy": "script",
        "createdDate": "2017-03-15T13:43:51.268Z",
        "updatedDate": "2018-02-23T15:14:53.115Z",
        "updatedBy": "emmett.j.osullivan@gmail.com"
      },
      {
        "_id": "58c669deb8a0ebcf9c5b93dc",
        "firstName": "Eoghan",
        "surname": "Ahern",
        "addressLine1": "5 Owenabue Drive",
        "addressLine2": "Carrigaline",
        "addressLine3": "",
        "dateOfBirth": "2009-10-10T00:00:00.000Z",
        "yearOfBirth": 2009,
        "medicalConditions": "",
        "contactName": "Therese Ahern",
        "contactMobileNumber": "087 9564971",
        "contactHomeNumber": "086 3917516",
        "contactEmailAddress": "thereseaherne@gmail.com",
        "school": "Scoil Mhuire Lourdes",
        "lastRegisteredDate": "2018-02-17T00:00:00.000Z",
        "lastRegisteredYear": 2018,
        "registeredYears": [
            2015,
            2016,
            2017,
            2018
        ],
        "__v": 2,
        "createdBy": "script",
        "createdDate": "2017-03-15T13:43:51.268Z",
        "updatedDate": "2018-02-23T14:21:46.480Z",
        "updatedBy": "emmett.j.osullivan@gmail.com"
      },
      {
        "_id": "58c669deb8a0ebcf9c5b93dd",
        "firstName": "Cian",
        "surname": "Aherne",
        "addressLine1": "Cois Dara",
        "addressLine2": "Raheens",
        "addressLine3": "Carrigaline",
        "dateOfBirth": "2009-03-20T00:00:00.000Z",
        "yearOfBirth": 2009,
        "medicalConditions": "",
        "contactName": "Maria Aherne",
        "contactMobileNumber": "087 4128709",
        "contactHomeNumber": "021 4379489",
        "contactEmailAddress": "mobrien_tara@hotmail.com",
        "school": "Gaelscoil",
        "lastRegisteredDate": "2017-02-04T00:00:00.000Z",
        "lastRegisteredYear": 2017,
        "registeredYears": [
            2016,
            2017
        ],
        "__v": 1,
        "createdBy": "script",
        "createdDate": "2017-03-15T13:43:51.268Z",
        "updatedDate": "2017-04-13T14:38:36.668Z",
        "updatedBy": "emmett.j.osullivan@gmail.com"
      }
    ];

    spyOn(playersService, 'readAllPlayers')
      .and.returnValue(of({
        "error": null,
        "body": {
          "players": players
        }
      }));

    spyOn(playersService, 'createPlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          "player": {
            "_id": "58c729bab8a0eaef9c5b9422",
            "firstName": "New",
            "surname": "Player",
            "addressLine1": "New Address",
            "addressLine2": "",
            "addressLine3": "",
            "dateOfBirth": "2010-02-01T00:00:00.000Z",
            "yearOfBirth": 2009,
            "medicalConditions": "",
            "contactName": "Player Contact",
            "contactMobileNumber": "087 1234567",
            "contactHomeNumber": "",
            "contactEmailAddress": "playercontact@gmail.com",
            "school": "",
            "lastRegisteredDate": "2018-08-24T00:00:00.000Z",
            "lastRegisteredYear": 2018,
            "registeredYears": [
                2018
            ],
            "__v": 1,
            "createdBy": "script",
            "createdDate": "2018-08-24T13:43:51.268Z",
            "updatedDate": "2018-08-24T09:55:59.735Z",
            "updatedBy": "unittest@gmail.com"
          }
        }
      }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize group year field', () => {
    expect(component.managePlayersForm.controls['groupYear'].value).toEqual('Select Year');
  });

  it('should initialize group year option 1', () => {
    expect(fixture.nativeElement.querySelector('select').options[0].text).toEqual('Select Year');  
  });

  it('should initialize group year option 7', () => {
    expect(fixture.nativeElement.querySelector('select').options[6].text).toEqual('2013');  
  });

  it('should initialize search players button', () => {
    expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeTruthy();  
  });

  it('should initialize search results panel', () => {
    expect(fixture.nativeElement.querySelector('#message-panel > p').hidden).toBeFalsy();  
  });

  it('should initialize first name field', () => {
    expect(component.managePlayersForm.controls['firstName'].value).toEqual('');
  });

  it('should initialize surname field', () => {
    expect(component.managePlayersForm.controls['surname'].value).toEqual('');
  });

  it('should initialize address line 1 field', () => {
    expect(component.managePlayersForm.controls['addressLine1'].value).toEqual('');
  });

  it('should initialize address line 2 field', () => {
    expect(component.managePlayersForm.controls['addressLine2'].value).toEqual('');
  });

  it('should initialize address line 3 field', () => {
    expect(component.managePlayersForm.controls['addressLine3'].value).toEqual('');
  });

  it('should initialize medical conditions field', () => {
    expect(component.managePlayersForm.controls['medicalConditions'].value).toEqual('');
  });

  it('should initialize school field', () => {
    expect(component.managePlayersForm.controls['school'].value).toEqual('');
  });

  it('should initialize contact name field', () => {
    expect(component.managePlayersForm.controls['contactName'].value).toEqual('');
  });

  it('should initialize contact email address field', () => {
    expect(component.managePlayersForm.controls['contactEmailAddress'].value).toEqual('');
  });

  it('should initialize contact mobile number field', () => {
    expect(component.managePlayersForm.controls['contactMobileNumber'].value).toEqual('');
  });

  it('should initialize contact home number field', () => {
    expect(component.managePlayersForm.controls['contactHomeNumber'].value).toEqual('');
  });

  it('should initialize reset button', () => {
    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeTruthy();
  });

  it('should initialize submit button', () => {
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should update form value', () => {
    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('User');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line 1');
    component.managePlayersForm.controls['addressLine2'].setValue('Address Line 2');
    component.managePlayersForm.controls['addressLine3'].setValue('Address Line 3');
    component.managePlayersForm.controls['medicalConditions'].setValue('None');
    component.managePlayersForm.controls['school'].setValue('Test School');
    component.managePlayersForm.controls['contactName'].setValue('Test Parent');
    component.managePlayersForm.controls['contactEmailAddress'].setValue('parent@test.com');
    component.managePlayersForm.controls['contactMobileNumber'].setValue('08712345678');
    component.managePlayersForm.controls['contactHomeNumber'].setValue('02187654321');

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': 'Select Year',
      'firstName': 'Test',
      'surname': 'User',
      'addressLine1': 'Address Line 1',
      'addressLine2': 'Address Line 2',
      'addressLine3': 'Address Line 3',
      'school': 'Test School',
      'medicalConditions': 'None',
      'contactName': 'Test Parent',
      'contactEmailAddress': 'parent@test.com',
      'contactMobileNumber': '08712345678',
      'contactHomeNumber': '02187654321' 
    });
  });

  it('should validate invalid first name', () => {
    component.managePlayersForm.controls['firstName'].setValue('');
    expect(component.managePlayersForm.controls['firstName'].invalid).toBeTruthy();
  });

  it('should validate valid first name', () => {
    component.managePlayersForm.controls['firstName'].setValue('Test');
    expect(component.managePlayersForm.controls['firstName'].invalid).toBeFalsy();
  });

  it('should validate invalid surname', () => {
    component.managePlayersForm.controls['surname'].setValue('');
    expect(component.managePlayersForm.controls['surname'].invalid).toBeTruthy();
  });

  it('should validate valid surname', () => {
    component.managePlayersForm.controls['surname'].setValue('User');
    expect(component.managePlayersForm.controls['surname'].invalid).toBeFalsy();
  });

  it('should validate invalid address line 1', () => {
    component.managePlayersForm.controls['addressLine1'].setValue('');
    expect(component.managePlayersForm.controls['addressLine1'].invalid).toBeTruthy();
  });

  it('should validate valid address line 1', () => {
    component.managePlayersForm.controls['addressLine1'].setValue('Test');
    expect(component.managePlayersForm.controls['addressLine1'].invalid).toBeFalsy();
  });

  it('should disable date of birth picker for invalid group year', () => {
    component.onChangeGroupYear('Select Year');

    expect(component.dateOfBirthPickerEnabled).toBeFalsy();
  });

  it('should enable date of birth picker for valid group year', () => {
    component.onChangeGroupYear('2011');

    expect(component.dateOfBirthPickerEnabled).toBeTruthy();
  });

  it('should set date of birth to yyyy-MM-dd after change of group year', () => {
    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue('2010-01-01');

    component.onChangeGroupYear('2011');

    expect(component.managePlayersForm.controls['dateOfBirthPicker'].value.datePickerTextBox).toEqual('yyyy-MM-dd');
  });

  it('should initialize date of birth picker start date after change of group year', () => {
    component.dateOfBirthPickerStartDate = { year: 2011, month: 6 }
    
    component.onChangeGroupYear('2009');

    expect(component.dateOfBirthPickerStartDate).toEqual({
      year: 2009,
      month: 6
    });
  });

  it('should initialize date of birth picker min date after change of group year', () => {
    component.dateOfBirthPickerMinDate = { year: 2012, month: 1, day: 1 };
    
    component.onChangeGroupYear('2010');

    expect(component.dateOfBirthPickerMinDate).toEqual({
      year: 2010,
      month: 1,
      day: 1
    });
  });

  it('should initialize date of birth picker max date after change of group year', () => {
    component.dateOfBirthPickerMaxDate = { year: 2012, month: 12, day: 31 };
    
    component.onChangeGroupYear('2012');

    expect(component.dateOfBirthPickerMaxDate).toEqual({
      year: 2012,
      month: 12,
      day: 31
    });
  });

  it('should set new group year after change of group year', () => {
    component.groupYear = '2009';

    component.onChangeGroupYear('2010');

    expect(component.groupYear).toEqual('2010');
  });

  it('should read group players after change of group year', () => {
    component.groupPlayers = null;

    component.onChangeGroupYear('2009');

    expect(JSON.stringify(component.groupPlayers)).toEqual(JSON.stringify(players));
  });

  it('should disable search players button for invalid date of birth', () => {
    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue('yyyy-MM-dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeTruthy();
  });

  it('should enable search players button for valid date of birth', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeFalsy();
  });

  it('should disable search players button after a player search', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeTruthy();
  });

  it('should clear playerDetails after a player search', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(component.playerDetails).toEqual(<IPlayer>{});
  });
  
  it('should enable search players button after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 10,
      day: 12});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeFalsy();
  });
  
  it('should display players in search results panel', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 10,
      day: 10});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr > td:nth-child(1)').innerHTML).toEqual('Ahern');  
  });

  it('should display no player found message in search results panel', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(2)').hidden).toBeFalsy();  
  });

  it('should move into add player mode if no player found', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(component.currentState).toEqual(component.formState.AddPlayer);  
  });

  it('should select player to edit', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(component.playerDetails._id).toEqual('58c669deb8a0ebcf9c5b93dd');  
  });

  it('should display editing player message after selecting a player to edit', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(3)').innerHTML).toEqual('Editing Cian Aherne')
  });

  it('should move into edit player mode after selecting a player to edit', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(component.currentState).toEqual(component.formState.EditPlayer);
  });

  it('should initialize last registered date to be today when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  });

  it('should display player details when editing a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2009',
      'dateOfBirthPicker': Object({ datePickerTextBox: Object({ year: 2009, month: 3, day: 20 }) }),
      'lastRegisteredDatePicker': Object({ 
        datePickerTextBox: Object({
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        })
      }),
      'firstName': 'Cian',
      'surname': 'Aherne',
      'addressLine1': 'Cois Dara',
      'addressLine2': 'Raheens',
      'addressLine3': 'Carrigaline',
      'school': 'Gaelscoil',
      'medicalConditions': '',
      'contactName': 'Maria Aherne',
      'contactEmailAddress': 'mobrien_tara@hotmail.com',
      'contactMobileNumber': '087 4128709',
      'contactHomeNumber': '021 4379489' 
    });
  });

  it('should disable first name when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-first-name').disabled).toBeTruthy();  
  });

  it('should disable surname when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-surname').disabled).toBeTruthy();  
  });

  it('should enable address line 1 when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line1').disabled).toBeFalsy();  
  });

  it('should enable address line 2 when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line2').disabled).toBeFalsy();  
  });

  it('should enable address line 3 when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line3').disabled).toBeFalsy();  
  });

  it('should enable school when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-school').disabled).toBeFalsy();  
  });

  it('should enable medical conditions when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-medical-conditions').disabled).toBeFalsy();  
  });

  it('should enable contact name when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeFalsy();  
  });

  it('should enable contact email address when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeFalsy();  
  });

  it('should enable contact mobile number when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeFalsy();  
  });

  it('should enable contact home number when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeFalsy();  
  });

  it('should enable reset button when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeFalsy();  
  });

  it('should enable save player button when editing a player', () => {
    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should set last registered date field to be today when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  });

  it('should display blank player details when adding a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2010',
      'dateOfBirthPicker': Object({ datePickerTextBox: Object({ year: 2010, month: 2, day: 1 }) }),
      'lastRegisteredDatePicker': Object({ 
        datePickerTextBox: Object({
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }) 
      }),
      'firstName': '',
      'surname': '',
      'addressLine1': '',
      'addressLine2': '',
      'addressLine3': '',
      'school': '',
      'medicalConditions': '',
      'contactName': '',
      'contactEmailAddress': '',
      'contactMobileNumber': '',
      'contactHomeNumber': '' 
    });
  });

  it('should enable first name when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-first-name').disabled).toBeFalsy();  
  });

  it('should enable surname when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-surname').disabled).toBeFalsy();  
  });

  it('should enable address line 1 when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line1').disabled).toBeFalsy();  
  });

  it('should enable address line 2 when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line2').disabled).toBeFalsy();  
  });

  it('should enable address line 3 when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line3').disabled).toBeFalsy();  
  });

  it('should enable school when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-school').disabled).toBeFalsy();  
  });

  it('should enable medical conditions when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-medical-conditions').disabled).toBeFalsy();  
  });

  it('should enable contact name when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeFalsy();  
  });

  it('should enable contact email address when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeFalsy();  
  });

  it('should enable contact mobile number when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeFalsy();  
  });

  it('should enable contact home number when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeFalsy();  
  });

  it('should enable reset button when adding a player', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeFalsy();  
  });

  it('should enable save player button when adding a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Player');
    component.managePlayersForm.controls['addressLine1'].setValue('Player');
    
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  });

  it('should set last registered date field to yyyy-MM-dd after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual('yyyy-MM-dd');
  });

  it('should untouch last registered date field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox.touched).toBeFalsy();
  });

  it('should disable last registered date field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.lastRegisteredDatePickerEnabled).toBeFalsy();
  });

  it('should blank player fields after a new date of birth is entered', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2010',
      'dateOfBirthPicker': Object({ datePickerTextBox: Object({ year: 2010, month: 2, day: 1 }) }),
      'firstName': '',
      'surname': '',
      'addressLine1': '',
      'addressLine2': '',
      'addressLine3': '',
      'school': '',
      'medicalConditions': '',
      'contactName': '',
      'contactEmailAddress': '',
      'contactMobileNumber': '',
      'contactHomeNumber': '' 
    });
  });

  it('should untouch first name field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['firstName'].touched).toBeFalsy(); 
  });

  it('should disable first name field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-first-name').disabled).toBeTruthy();  
  });

  it('should untouch surname field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['surname'].touched).toBeFalsy(); 
  });

  it('should disable surname field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-surname').disabled).toBeTruthy();  
  });

  it('should untouch address line 1 field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['addressLine1'].touched).toBeFalsy(); 
  });

  it('should disable address line 1 field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line1').disabled).toBeTruthy();  
  });

  it('should disable address line 2 field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line2').disabled).toBeTruthy();  
  });

  it('should disable address line 3 field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line3').disabled).toBeTruthy();  
  });

  it('should disable school field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-school').disabled).toBeTruthy();  
  });

  it('should disable medical conditions field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-medical-conditions').disabled).toBeTruthy();  
  });

  it('should disable contact name field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeTruthy();  
  });

  it('should disable contact email address field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeTruthy();  
  });

  it('should disable contact mobile number field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeTruthy();  
  });

  it('should disable contact home number field after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeTruthy();  
  });

  it('should disable reset button after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeTruthy();  
  });

  it('should disable save player button after a new date of birth is entered', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should set last registered date field to yyyy-MM-dd after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual('yyyy-MM-dd');
  });

  it('should untouch last registered date field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox.touched).toBeFalsy();
  });

  it('should disable last registered date field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.lastRegisteredDatePickerEnabled).toBeFalsy();
  });

  it('should blank player fields after a new date of birth is entered', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2009',
      'dateOfBirthPicker': Object({ datePickerTextBox: 'yyyy-MM-dd' }),
      'firstName': '',
      'surname': '',
      'addressLine1': '',
      'addressLine2': '',
      'addressLine3': '',
      'school': '',
      'medicalConditions': '',
      'contactName': '',
      'contactEmailAddress': '',
      'contactMobileNumber': '',
      'contactHomeNumber': '' 
    });
  });

  it('should untouch first name field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['firstName'].touched).toBeFalsy(); 
  });

  it('should disable first name field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-first-name').disabled).toBeTruthy();  
  });

  it('should untouch surname field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['surname'].touched).toBeFalsy(); 
  });

  it('should disable surname field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-surname').disabled).toBeTruthy();  
  });

  it('should untouch address line 1 field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['addressLine1'].touched).toBeFalsy(); 
  });

  it('should disable address line 1 field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line1').disabled).toBeTruthy();  
  });

  it('should disable address line 2 field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line2').disabled).toBeTruthy();  
  });

  it('should disable address line 3 field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line3').disabled).toBeTruthy();  
  });

  it('should disable school field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-school').disabled).toBeTruthy();
  });

  it('should disable medical conditions field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-medical-conditions').disabled).toBeTruthy();  
  });

  it('should disable contact name field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeTruthy();  
  });

  it('should disable contact email address field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeTruthy();  
  });

  it('should disable contact mobile number field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeTruthy();  
  });

  it('should disable contact home number field after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeTruthy();  
  });

  it('should disable reset button after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeTruthy();  
  });

  it('should disable save player button after a new group year is selected', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should set last registered date field to today after reset button is pressed in add player mode', () => {
    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  });

  it('should blank player fields after reset button is pressed in add player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2010',
      'dateOfBirthPicker': Object({ 
        datePickerTextBox: Object({ 
          day: 1,
          month: 2,
          year: 2010
        }) 
      }),
      'lastRegisteredDatePicker': Object({ 
        datePickerTextBox: Object({ 
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }) 
      }),
      'firstName': '',
      'surname': '',
      'addressLine1': '',
      'addressLine2': '',
      'addressLine3': '',
      'school': '',
      'medicalConditions': '',
      'contactName': '',
      'contactEmailAddress': '',
      'contactMobileNumber': '',
      'contactHomeNumber': '' 
    });
  });

  it('should untouch first name field after reset button is pressed in add player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['firstName'].touched).toBeFalsy(); 
  });

  it('should untouch surname field after reset button is pressed in add player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['surname'].touched).toBeFalsy(); 
  });

  it('should untouch address line 1 field after reset button is pressed in add player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['addressLine1'].touched).toBeFalsy(); 
  });

  it('should set last registered date field to today after reset button is pressed in edit player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear() + 1
    });

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['lastRegisteredDatePicker'].value.datePickerTextBox).toEqual({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  });

  it('should display player fields after reset button is pressed in add player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    let currentDate: Date = new Date(Date.now());

    component.managePlayersForm.controls['firstName'].setValue('New');

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.value).toEqual({
      'groupYear': '2009',
      'dateOfBirthPicker': Object({ 
        datePickerTextBox: Object({ 
          year: 2009, 
          month: 3, 
          day: 20 
        }) 
      }),
      'lastRegisteredDatePicker': Object({ 
        datePickerTextBox: Object({
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        })
      }),
      'firstName': 'Cian',
      'surname': 'Aherne',
      'addressLine1': 'Cois Dara',
      'addressLine2': 'Raheens',
      'addressLine3': 'Carrigaline',
      'school': 'Gaelscoil',
      'medicalConditions': '',
      'contactName': 'Maria Aherne',
      'contactEmailAddress': 'mobrien_tara@hotmail.com',
      'contactMobileNumber': '087 4128709',
      'contactHomeNumber': '021 4379489' 
    });
  });

  it('should untouch first name field after reset button is pressed in edit player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('New');

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['firstName'].touched).toBeFalsy(); 
  });

  it('should untouch surname field after reset button is pressed in edit player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('New');

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['surname'].touched).toBeFalsy(); 
  });

  it('should untouch address line 1 field after reset button is pressed in edit player mode', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('New');

    fixture.detectChanges();

    component.onReset();

    fixture.detectChanges();

    expect(component.managePlayersForm.controls['addressLine1'].touched).toBeFalsy(); 
  });

  it('should disable submit button for invalid form', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy(); 
  });

  it('should enable submit button for valid form', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();
    
    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy(); 
  });

  it('should read date of birth when saving a new player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    expect(component.playerDetails.dateOfBirth).toEqual('2010-02-01T00:00:00.000Z');
  });

  it('should read last registered date when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
      year: 2018,
      month: 8,
      day: 14
    });

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.lastRegisteredDate).toEqual('2018-08-14T00:00:00.000Z');
  });

  it('should read player first name when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.firstName).toEqual('Test');
  });

  it('should read player surname when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.surname).toEqual('Name');
  });

  it('should read player address line 1 when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.addressLine1).toEqual('Address Line');
  });

  it('should read player address line 2 when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['addressLine2'].setValue('Address Line 2');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.addressLine2).toEqual('Address Line 2');
  });

  it('should read player address line 3 when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['addressLine3'].setValue('Address Line 3');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.addressLine3).toEqual('Address Line 3');
  });

  it('should read player school when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['school'].setValue('Test School');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.school).toEqual('Test School');
  });

  it('should read player medical conditions when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['medicalConditions'].setValue('None');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.medicalConditions).toEqual('None');
  });

  it('should read contact name when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['contactName'].setValue('Test Contact');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.contactName).toEqual('Test Contact');
  });

  it('should read contact email address when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['contactEmailAddress'].setValue('testcontact@gmail.com');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.contactEmailAddress).toEqual('testcontact@gmail.com');
  });

  it('should read contact mobile number when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['contactMobileNumber'].setValue('087 1234567');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.contactMobileNumber).toEqual('087 1234567');
  });

  it('should read contact home number when saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');
    component.managePlayersForm.controls['contactHomeNumber'].setValue('021 7654321');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.playerDetails.contactHomeNumber).toEqual('021 7654321');
  });

  it('should call playersService.updatePlayer when updating a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2009');

    fixture.detectChanges();

    component.onChangeGroupYear('2009');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2009,
      month: 3,
      day: 20});

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.onClickRow('58c669deb8a0ebcf9c5b93dd');

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');

    fixture.detectChanges();

    spyOn(playersService, 'updatePlayer')
    .and.returnValue(of({
      "error": null,
      "body": {
        "player": {
          "_id": "58c729bab8a0eaef9c5b9422",
          "firstName": "Test",
          "surname": "Player",
          "addressLine1": "New Address",
          "addressLine2": "",
          "addressLine3": "",
          "dateOfBirth": "2010-02-01T00:00:00.000Z",
          "yearOfBirth": 2009,
          "medicalConditions": "",
          "contactName": "Player Contact",
          "contactMobileNumber": "087 1234567",
          "contactHomeNumber": "",
          "contactEmailAddress": "playercontact@gmail.com",
          "school": "",
          "lastRegisteredDate": "2018-08-24T00:00:00.000Z",
          "lastRegisteredYear": 2018,
          "registeredYears": [
              2018
          ],
          "__v": 2,
          "createdBy": "script",
          "createdDate": "2018-08-24T13:43:51.268Z",
          "updatedDate": "2018-08-24T09:55:59.735Z",
          "updatedBy": "unittest@gmail.com"
        }
      }
    }));

    component.onSubmit(component.managePlayersForm.value);

    expect(playersService.updatePlayer).toHaveBeenCalled();
  });

  it('should call playersService.createPlayer when adding a new player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    expect(playersService.createPlayer).toHaveBeenCalled();
  });

  it('should add new player to group players after adding a new player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();

    component.onSubmit(component.managePlayersForm.value);

    expect(component.groupPlayers.length).toEqual(5);
  });

  it('should display player saved message after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(4)').hidden).toBeFalsy();  
  });

  it('should disable last registered date field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(component.lastRegisteredDatePickerEnabled).toBeFalsy();  
  });

  it('should disable first name field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-first-name').disabled).toBeTruthy();  
  });

  it('should disable surname field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-surname').disabled).toBeTruthy();  
  });

  it('should disable address line 1 field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line1').disabled).toBeTruthy();  
  });

  it('should disable address line 2 field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line2').disabled).toBeTruthy();  
  });

  it('should disable address line 3 field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-address-line3').disabled).toBeTruthy();  
  });

  it('should disable school field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-school').disabled).toBeTruthy();  
  });

  it('should disable medical conditions field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#player-medical-conditions').disabled).toBeTruthy();  
  });

  it('should disable contact name field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-name').disabled).toBeTruthy();  
  });

  it('should disable contact email address field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-email-address').disabled).toBeTruthy();  
  });

  it('should disable contact mobile number field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-mobile-number').disabled).toBeTruthy();  
  });

  it('should disable contact home number field after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#contact-home-number').disabled).toBeTruthy();  
  });

  it('should disable reset button after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#reset').disabled).toBeTruthy();  
  });

  it('should disable save player button after saving a player', () => {
    component.managePlayersForm.controls['groupYear'].setValue('2010');

    fixture.detectChanges();

    component.onChangeGroupYear('2010');

    component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
      year: 2010,
      month: 2,
      day: 1
    });

    fixture.detectChanges();

    component.onSearchPlayers();

    fixture.detectChanges();

    component.managePlayersForm.controls['firstName'].setValue('Test');
    component.managePlayersForm.controls['surname'].setValue('Name');
    component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

    fixture.detectChanges();
    
    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
