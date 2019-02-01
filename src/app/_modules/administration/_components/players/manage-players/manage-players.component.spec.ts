import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler } from 'rxjs';

import { IPlayer, IPlayerSummary, IGroup } from '../../../../../_models/index';
import { PlayersService, GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ManagePlayersComponent } from './manage-players.component';


describe('ManagePlayersComponent', () => {
  let component: ManagePlayersComponent;
  let fixture: ComponentFixture<ManagePlayersComponent>;

  let playersService: PlayersService,
      groupsService: GroupsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ManagePlayersComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        PlayersService,
        GroupsService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlayersComponent);
    component = fixture.componentInstance;

    playersService = TestBed.get(PlayersService);
    groupsService = TestBed.get(GroupsService);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
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

  // it('should initialize date of birth field', () => {
  //   //   expect(component.coachForm.controls['phoneNumber'].value).toEqual('');
  // });

  // it('should initialize submit button', () => {
  //   expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();
  // });

  // it('should initialize search results panel', () => {
  //   expect(fixture.nativeElement.querySelector('#message-panel > p').hidden).toBeFalsy();  
  // });

  // it('should update form value', () => {
  //   component.dateOfBirthPickerEnabled = true;
  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 7,
  //     day: 3});

  //   component.lastRegisteredDatePickerEnabled = true;
  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['firstName'].enable()
  //   component.managePlayersForm.controls['surname'].enable();
  //   component.managePlayersForm.controls['addressLine1'].enable();
  //   component.managePlayersForm.controls['addressLine2'].enable();
  //   component.managePlayersForm.controls['addressLine3'].enable();
  //   component.managePlayersForm.controls['medicalConditions'].enable();
  //   component.managePlayersForm.controls['school'].enable();
  //   component.managePlayersForm.controls['contactName'].enable();
  //   component.managePlayersForm.controls['contactEmailAddress'].enable();
  //   component.managePlayersForm.controls['contactMobileNumber'].enable();
  //   component.managePlayersForm.controls['contactHomeNumber'].enable()

  //   component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
  //     year: 2018,
  //     month: 10,
  //     day: 18});
  //   component.managePlayersForm.controls['firstName'].setValue('Test');
  //   component.managePlayersForm.controls['surname'].setValue('Player');
  //   component.managePlayersForm.controls['addressLine1'].setValue('Address Line 1');
  //   component.managePlayersForm.controls['addressLine2'].setValue('Address Line 2');
  //   component.managePlayersForm.controls['addressLine3'].setValue('Address Line 3');
  //   component.managePlayersForm.controls['medicalConditions'].setValue('None');
  //   component.managePlayersForm.controls['school'].setValue('Test School');
  //   component.managePlayersForm.controls['contactName'].setValue('Test Parent');
  //   component.managePlayersForm.controls['contactEmailAddress'].setValue('parent@test.com');
  //   component.managePlayersForm.controls['contactMobileNumber'].setValue('08712345678');
  //   component.managePlayersForm.controls['contactHomeNumber'].setValue('02187654321');

  //   expect(component.managePlayersForm.value).toEqual({
  //     'groupYear': 'Select Year',
  //     'dateOfBirthPicker': Object({ datePickerTextBox: Object({ year: 2010, month: 7, day: 3 }) }),
  //     'lastRegisteredDatePicker': Object({ datePickerTextBox: Object({ year: 2018, month: 10, day: 18 }) }),
  //     'firstName': 'Test',
  //     'surname': 'Player',
  //     'addressLine1': 'Address Line 1',
  //     'addressLine2': 'Address Line 2',
  //     'addressLine3': 'Address Line 3',
  //     'school': 'Test School',
  //     'medicalConditions': 'None',
  //     'contactName': 'Test Parent',
  //     'contactEmailAddress': 'parent@test.com',
  //     'contactMobileNumber': '08712345678',
  //     'contactHomeNumber': '02187654321' 
  //   });
  // });

  // it('should disable search players button for invalid date of birth', () => {
  //   component.onChangeGroupYear('2009');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue('yyyy-MM-dd');

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeTruthy();
  // });

  // it('should enable search players button for valid date of birth', () => {
  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeFalsy();
  // });

  // it('should disable search players button after a player search', () => {
  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeTruthy();
  // });

  // it('should enable search players button after a new date of birth is entered', () => {
  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2009,
  //     month: 10,
  //     day: 12});

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#search-players').disabled).toBeFalsy();
  // });
  
  // it('should display players in search results panel', () => {
  //   component.onChangeGroupYear('2008');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2008,
  //     month: 5,
  //     day: 4});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#players-table > tbody > tr > td:nth-child(1)').innerHTML).toEqual('Watkins');  
  // });

  // it('should display no player found message in search results panel', () => {
  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(3)').hidden).toBeFalsy();  
  // });

  // it('should move into add player mode if no player found', () => {
  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   expect(component.currentState).toEqual(component.formState.AddPlayer);  
  // });

  // it('should move into players listed mode if players found', () => {
  //   component.onChangeGroupYear('2008');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2008,
  //     month: 5,
  //     day: 4});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   expect(component.currentState).toEqual(component.formState.PlayersListed);
  // });

  // it('should select player to edit', () => {
  //   component.onChangeGroupYear('2009');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2009,
  //     month: 9,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.onClickRow('6e748e8723733e96603618cb');

  //   fixture.detectChanges();

  //   expect(component.playerDetails._id).toEqual('6e748e8723733e96603618cb');  
  // });

  // it('should display editing player message after selecting a player to edit', () => {
  //   component.onChangeGroupYear('2009');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2009,
  //     month: 9,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.onClickRow('6e748e8723733e96603618cb');

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(4)').innerHTML).toEqual('Editing Joseph Gray')
  // });

  // it('should move into edit player mode after selecting a player to edit', () => {
  //   component.onChangeGroupYear('2009');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2009,
  //     month: 9,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.onClickRow('6e748e8723733e96603618cb');

  //   fixture.detectChanges();

  //   expect(component.currentState).toEqual(component.formState.EditPlayer);
  // });

  // it('should read date of birth when saving a new player', () => {
  //   component.managePlayersForm.controls['groupYear'].setValue('2010');

  //   fixture.detectChanges();

  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['firstName'].setValue('Test');
  //   component.managePlayersForm.controls['surname'].setValue('Name');
  //   component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

  //   fixture.detectChanges();

  //   component.onSubmit(component.managePlayersForm.value);

  //   expect(component.playerDetails.dateOfBirth).toEqual('2010-02-01T00:00:00.000Z');
  // });

  // it('should read last registered date when saving a player', () => {
  //   component.managePlayersForm.controls['groupYear'].setValue('2010');

  //   fixture.detectChanges();

  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1});

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['lastRegisteredDatePicker'].get('datePickerTextBox').setValue({
  //     year: 2018,
  //     month: 8,
  //     day: 14
  //   });

  //   component.managePlayersForm.controls['firstName'].setValue('Test');
  //   component.managePlayersForm.controls['surname'].setValue('Name');
  //   component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

  //   fixture.detectChanges();

  //   component.onSubmit(component.managePlayersForm.value);

  //   fixture.detectChanges();

  //   expect(component.playerDetails.lastRegisteredDate).toEqual('2018-08-14T00:00:00.000Z');
  // });


  // it('should display player saved message after a player is saved', fakeAsync(() => {
  //   component.managePlayersForm.controls['groupYear'].setValue('2010');

  //   fixture.detectChanges();

  //   component.onChangeGroupYear('2010');

  //   component.managePlayersForm.controls['dateOfBirthPicker'].get('datePickerTextBox').setValue({
  //     year: 2010,
  //     month: 2,
  //     day: 1
  //   });

  //   fixture.detectChanges();

  //   component.onSearchPlayers();

  //   fixture.detectChanges();

  //   component.managePlayersForm.controls['firstName'].setValue('Test');
  //   component.managePlayersForm.controls['surname'].setValue('Name');
  //   component.managePlayersForm.controls['addressLine1'].setValue('Address Line');

  //   fixture.detectChanges();
    
  //   component.onSubmit(component.managePlayersForm.value);

  //   tick();

  //   fixture.detectChanges();

  //   expect(fixture.nativeElement.querySelector('#message-panel > :nth-child(5)').hidden).toBeFalsy();  
  // }));
});
