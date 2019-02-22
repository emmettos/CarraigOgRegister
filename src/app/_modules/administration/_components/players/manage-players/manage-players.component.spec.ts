import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NgbModule, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { of } from 'rxjs';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { IPlayerSummary, IGroup } from '../../../../../_models/index';
import { PlayersService, GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ManagePlayersComponent } from './manage-players.component';
import { PlayerPopupComponent } from '../player-popup/player-popup.component';
import { PlayerFormComponent } from '../player-form/player-form.component';
import { ConfirmDeletePlayerComponent } from '../confirm-delete-player/confirm-delete-player.component';


describe('ManagePlayersComponent', () => {
  let component: ManagePlayersComponent;
  let fixture: ComponentFixture<ManagePlayersComponent>;

  let playersService: PlayersService,
      groupsService: GroupsService,
      toasterService: ToasterService,
      modalService: NgbModal;

  let groups: IGroup[],
      players: IPlayerSummary[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManagePlayersComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot()
      ],
      providers: [
        PlayersService,
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
    fixture = TestBed.createComponent(ManagePlayersComponent);
    component = fixture.componentInstance;

    playersService = TestBed.get(PlayersService);
    groupsService = TestBed.get(GroupsService);
    toasterService = TestBed.get(ToasterService);
    modalService = TestBed.get(NgbModal);

    groups = [
      {
        'id': 3,
        'yearId': 1,
        'name': 'Under 8',
        'yearOfBirth': 2010,
        'footballCoachId': 5,
        'hurlingCoachId': 6,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'updatedBy': 'admin@carraigog.com',
        'version': '2018-02-27T15:57:21.582Z'
      },
      {
        'id': 2,
        'yearId': 1,
        'name': 'Under 9',
        'yearOfBirth': 2009,
        'footballCoachId': 3,
        'hurlingCoachId': 4,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'updatedBy': 'admin@carraigog.com',
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
        'updatedDate': '2018-02-27T15:57:21.582Z',
        'updatedBy': 'admin@carraigog.com',
        'version': '2018-02-27T15:57:21.582Z'
      }
    ];

    players = [
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
    ];

    spyOn(toasterService, 'pop');
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize date of birth field', () => {
    fixture.detectChanges();

    expect(component.managePlayersForm.controls['dateOfBirth'].value).toEqual('');
  });

  it('should call groupsService.readGroups', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': []
        }  
      }));

    fixture.detectChanges();

    expect(groupsService.readGroups).toHaveBeenCalled();
  });

  it('should display no groups warning popup', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': []
        }
      }));

    fixture.detectChanges();

    expect(toasterService.pop).toHaveBeenCalledWith('warning', 'No Groups Found', 'Please add some groups');
  });

  it('should disable date of birth field for no groups', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': []
        }
      }));
      
    fixture.detectChanges();

    expect(component.managePlayersForm.controls['dateOfBirth'].disabled).toBeTruthy();
  });

  it('should set date of birth picker min date', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(component.dateOfBirthPicker.minDate).toEqual({ year: 2007, month: 1, day: 1 });
  });

  it('should set date of birth picker max date', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(component.dateOfBirthPicker.maxDate).toEqual({ year: 2010, month: 12, day: 31 });
  });

  it('should set date of birth picker start date', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(component.dateOfBirthPicker.startDate).toEqual({ year: 2009, month: 6 });
  });

  it('should initialize submit button', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should initialize search results panel', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-panel').hidden).toBeTruthy();  
  });

  it('should initialize message panel', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-panel > p').hidden).toBeFalsy();  
  });

  it('should hide add player button', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#add-player').hidden).toBeTruthy();  
  });

  it('should update form value', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();

    expect(component.managePlayersForm.value).toEqual({'dateOfBirth': Object({ year: 2010, month: 7, day: 3 })
    });
  });

  it('should validate empty date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue('');

    expect(component.managePlayersForm.controls['dateOfBirth'].invalid).toBeTruthy();
  });

  it('should validate invalid date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue('ddd');

    expect(component.managePlayersForm.controls['dateOfBirth'].invalid).toBeTruthy();
  });

  it('should validate outside range date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();
    
    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2015, month: 2, day: 13 });

    expect(component.managePlayersForm.controls['dateOfBirth'].invalid).toBeTruthy();
  });

  it('should validate valid date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    expect(component.managePlayersForm.controls['dateOfBirth'].invalid).toBeFalsy();
  });

  it('should disable search players button for invalid date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue('');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should enable search players button for valid date of birth', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  });

  it('should call playersService.searchPlayers', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2009, month: 10, day: 13 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    expect(playersService.searchPlayers).toHaveBeenCalled();
  });

  it('should sort returned players', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    expect(component.matchedPlayers).toEqual([
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
      },
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
      }
    ]);
  });

  it('should display player state', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(1)').style.getPropertyValue('badge-success')).toEqual('');
  });

  it('should display player surname', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(2)').innerHTML).toEqual('Wolfe');
  });

  it('should display player first name', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Matthew');
  });

  it('should display player address line 1', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(4)').innerHTML).toEqual('830 Green Gate Lane');
  });

  it('should display player address line 2', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('Clear Mount');
  });

  it('should display edit link', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(6) > a > span').innerHTML).toEqual('Edit');
  });

  it('should display delete link', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(7) > a > span').innerHTML).toEqual('Delete');
  });

  it('should display no player found message in message panel', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#message-panel > p:nth-child(2)').hidden).toBeFalsy();  
  });

  it('should display add player button if players found', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': players
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#add-player').hidden).toBeFalsy();  
  });

  it('should display add player button if no players found', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#add-player').hidden).toBeFalsy();  
  });

  it('should disable search players button after a player search', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  });

  it('should enable search players button after a new date of birth is entered', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    component.onDateOfBirthChange();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  });

  it('should enable search players button after a new date of birth is picked', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 3, day: 3 });

    fixture.detectChanges();

    spyOn(playersService, 'searchPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': []
        }
      }));

    component.onSubmit(component.managePlayersForm.value);

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3 });

    component.onDateOfBirthPickerChange(null);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  });

  it('should call playersService.readPlayerDetails when a player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow({
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
      'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
      'playerState': 0
    });

    expect(playersService.readPlayerDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when a player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-04T15:13:00.000Z',
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {}
      });

    component.onClickRow({
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
    });

    expect(modalService.open).toHaveBeenCalledWith(PlayerPopupComponent);
  });

  it('should call NgbModal.open when add player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickAddPlayer();

    expect(modalService.open).toHaveBeenCalledWith(PlayerFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully added player popup', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickAddPlayer();

    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Player Successfully Added', 'Matthew Moss');
  }));

  it('should display players after adding a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickAddPlayer();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(2)').innerHTML).toEqual('Wolfe');
  }));

  it('should disable search players button after successfully adding a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickAddPlayer();

    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  }));

  it('should enable search players button after failing adding a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.reject()
      });

    component.onClickAddPlayer();

    tick();

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  }));

  it('should call playersService.readPlayerDetails when edit player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        })
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });

    expect(playersService.readPlayerDetails).toHaveBeenCalledWith(2);
  });

  it('should call NgbModal.open when edit player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });

    expect(modalService.open).toHaveBeenCalledWith(PlayerFormComponent, { size: 'lg', backdrop: 'static' });
  });

  it('should display successfully updated player popup', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Player Successfully Updated', 'Matthew Moss');
  }));

  it('should display players after updating a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Matthew');
  }));

  it('should disable search players button after successfully editing a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
          playerDetails: {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
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
        })
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  }));

  it('should enable search players button after failing editing a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(playersService, 'readPlayerDetails')
      .and.returnValue(of({
        'error': null,
        'body': {
          'playerDetails': {
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
            'createdBy': 'script',
            'createdDate': '2017-03-15T13:43:51.268Z',
            'updatedDate': '2018-02-13T10:21:40.545Z',
            'updatedBy': 'admin@carraigog.com',
            'version': '2018-02-13T10:21:40.545Z'
          }
        }
      }));

    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.reject()
      });

    component.onClickEditPlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  }));

  it('should call NgbModal.open when delete player is selected', () => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
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
            }
          ]
        })
      });

    component.onClickDeletePlayer(new MouseEvent('click'), {
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
    });

    expect(modalService.open).toHaveBeenCalledWith(ConfirmDeletePlayerComponent, { backdrop: 'static' });
  });

  it('should display successfully deleted player popup', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
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
            }
          ]
        })
      });

    component.onClickDeletePlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    expect(toasterService.pop).toHaveBeenCalledWith('success', 'Player Successfully Deleted', 'Matthew Moss');
  }));

  it('should display players after deleting a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
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
            }
          ]
        })
      });

    component.onClickDeletePlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Michael');
  }));

  it('should disable search players button after successfully deleting a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.resolve({
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
            }
          ]
        })
      });

    component.onClickDeletePlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  }));

  it('should enable search players button after failing deleting a player', fakeAsync(() => {
    spyOn(groupsService, 'readGroups')
      .and.returnValue(of({
        'error': null,
        'body': {
          'groups': groups
        }
      }));

    fixture.detectChanges();

    component.managePlayersForm.controls['dateOfBirth'].setValue({ year: 2010, month: 7, day: 3});

    fixture.detectChanges();
    
    spyOn(modalService, 'open')
      .and.returnValue({
        componentInstance: {},
        result: Promise.reject()
      });

    component.onClickDeletePlayer(new MouseEvent('click'), {
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
    });
  
    tick();

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy();
  }));
});
