import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { of, asyncScheduler } from 'rxjs';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { IPlayer, IPlayerSummary, IGroup } from '../../../../../_models/index';
import { PlayersService, GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ManagePlayersComponent } from './manage-players.component';


fdescribe('ManagePlayersComponent', () => {
  let component: ManagePlayersComponent;
  let fixture: ComponentFixture<ManagePlayersComponent>;

  let playersService: PlayersService,
      groupsService: GroupsService,
      toasterService: ToasterService;

  let groups: IGroup[];

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
        ToasterService
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
    toasterService = TestBed.get(ToasterService);

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
      },
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

    expect(fixture.nativeElement.querySelector('#message-panel > p').hidden).toBeFalsy();  
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

    expect(component.managePlayersForm.value).toEqual({
      'dateOfBirth': Object({ year: 2010, month: 7, day: 3 })
    });
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
