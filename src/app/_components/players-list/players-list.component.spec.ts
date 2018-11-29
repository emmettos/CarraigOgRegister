import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../_helpers/index';
import { PlayersService } from '../../_services';

import { PlayersListComponent } from './players-list.component';


describe('PlayersListComponent', () => {
  let component: PlayersListComponent;
  let fixture: ComponentFixture<PlayersListComponent>;

  let playersService: PlayersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        PlayersListComponent 
      ],
      imports: [
        HttpClientTestingModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { 
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                groupName: 'Under 10',
                yearOfBirth: '2008'
              })
            }
          }
        },
        NgbModal,
        PlayersService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersListComponent);
    component = fixture.componentInstance;

    APP_SETTINGS.currentYear = 2018;

    playersService = TestBed.get(PlayersService);

    spyOn(playersService, 'readCurrentPlayers')
      .and.returnValue(of({
        'error': null,
        'body': {
          'players': [
            {
              '_id': 'aaf6ddc582e9d0d86610e025',
              'firstName': 'Joshua',
              'surname': 'Love',
              'addressLine1': '4032 Heliport Loop',
              'addressLine2': 'Gold Cliff',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2008-06-20T00:00:00.000Z',
              'yearOfBirth': 2008,
              'medicalConditions': '',
              'contactName': 'Dilan Love',
              'contactMobileNumber': '087 4765397',
              'contactHomeNumber': '021 9445529',
              'contactEmailAddress': 'dilan_love@hotmail.com',
              'school': 'Gaelscoil',
              'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
              'lastRegisteredYear': 2018,
              'registeredYears': [
                2018
              ],
              '__v': 1,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-02-13T14:38:36.668Z',
              'updatedBy': 'emmett.j.osullivan@gmail.com'
            },
            {
              '_id': '58c669deb8a0ebcf9c5b93c9',
              'firstName': 'James',
              'surname': 'Maxwell',
              'addressLine1': '485 Meadowcrest Lane',
              'addressLine2': 'Capitol',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2008-10-10T00:00:00.000Z',
              'yearOfBirth': 2008,
              'medicalConditions': 'Heart Murmur',
              'contactName': 'Kevia Maxwell',
              'contactMobileNumber': '087 3514954',
              'contactHomeNumber': '',
              'contactEmailAddress': 'kevia_maxwell@gmail.com',
              'school': 'Scoil Mhuire Lourdes',
              'lastRegisteredDate': '2018-05-09T00:00:00.000Z',
              'lastRegisteredYear': 2018,
              'registeredYears': [
                2013,
                2014,
                2015,
                2016,
                2017,
                2018
              ],
              '__v': 1,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'emmett.j.osullivan@gmail.com'
            },
            {
              '_id': 'b159d6e49a41877180ba3826',
              'firstName': 'Thomas',
              'surname': 'Watkins',
              'addressLine1': '115 Evergreen Lane',
              'addressLine2': 'Richmond',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2008-05-04T00:00:00.000Z',
              'yearOfBirth': 2008,
              'medicalConditions': 'None',
              'contactName': 'Finley Watkins',
              'contactMobileNumber': '086 5882764',
              'contactHomeNumber': '021 4834511',
              'contactEmailAddress': 'finley_watkins@gmail.com',
              'school': 'Scoil Mhuire Lourdes',
              'lastRegisteredDate': '2017-02-14T00:00:00.000Z',
              'lastRegisteredYear': 2017,
              'registeredYears': [
                2017
              ],
              '__v': 1,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2017-03-15T13:43:51.268Z',
              'updatedBy': 'emmett.j.osullivan@gmail.com'
            }
          ]
        }  
      }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read groupName parameter', () => {
    expect(component.groupName).toEqual('Under 10');
  });

  it('should call playersService.readCurrentPlayers', () => {
    expect(playersService.readCurrentPlayers).toHaveBeenCalled();
  });

  it('should pass yearOfBirth to playersService.readCurrentPlayers', () => {
    expect(playersService.readCurrentPlayers).toHaveBeenCalledWith(2008);
  });

  it('should display registered count', () => {
    expect(fixture.nativeElement.querySelector('#registered-count').innerHTML).toEqual('Regd 2');
  });

  it('should display new count', () => {
    expect(fixture.nativeElement.querySelector('#new-count').innerHTML).toEqual('New 1');
  });

  it('should display missing count', () => {
    expect(fixture.nativeElement.querySelector('#missing-count').innerHTML).toEqual('Missing 1');
  });

  it('should display first player', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1)')).toBeTruthy();
  });

  it('should display last player', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3)')).toBeTruthy();
  });

  it('should display regular player state', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should display new player state', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-success')).toEqual('');
  });

  it('should display missing player state', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should display surname', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Love');
  });

  it('should display first name', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(3)').innerHTML).toEqual('James');
  });

  it('should display address line 2', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('Richmond');
  });

  it('should display date of birth', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('20/06/2008');
  });

  it('should display last registered date', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(6)').innerHTML).toEqual('09/05/2018');
  });

  it('should display medical conditions', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(7)').innerHTML).toEqual('None');
  });

  it('should display school', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(8)').innerHTML).toEqual('Gaelscoil');
  });

  it('should highlight missing players', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('missing')).toEqual('');
  });

  it('should default sort by surname (first player)', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Love');
  });

  it('should default sort by surname (last player)', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('Watkins');
  });

  it('should sort by player state (first player)', () => {
    component.onClickHeader('playerState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(1) > span').style.getPropertyValue('badge-info')).toEqual('');
  });

  it('should sort by player state (last player)', () => {
    component.onClickHeader('playerState');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(1) > span').style.getPropertyValue('badge-warning')).toEqual('');
  });

  it('should sort by last registered date (first player)', () => {
    component.onClickHeader('lastRegisteredDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML).toEqual('14/02/2017');
  });

  it('should sort by last registered date (last player)', () => {
    component.onClickHeader('lastRegisteredDate');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(6)').innerHTML).toEqual('09/05/2018');
  });

  it('should flip existing sort (first player)', () => {
    component.onClickHeader('firstName');

    fixture.detectChanges();

    component.onClickHeader('firstName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Thomas');
  });

  it('should flip existing sort (last player)', () => {
    component.onClickHeader('firstName');

    fixture.detectChanges();

    component.onClickHeader('firstName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(3)').innerHTML).toEqual('James');
  });

  it('should display currently registered players', () => {
    component.filterForm.controls['currentlyRegistered'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#players-table > tbody > tr').length).toEqual(2);
  });

  it('should filter on player name', () => {
    component.filterForm.controls['nameFilter'].setValue('Joshua');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#players-table > tbody > tr').length).toEqual(1);
  });

  it('should display filter message', () => {
    component.filterForm.controls['nameFilter'].setValue('w');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 2 Players');
  });

  it('should select selected player details', () => {
    let modalService: NgbModal;

    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open');

    component.onClickRow(null, {
      '_id': 'b159d6e49a41877180ba3826',
      'firstName': 'Thomas',
      'surname': 'Watkins',
      'addressLine1': '115 Evergreen Lane',
      'addressLine2': 'Richmond',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2008-05-04T00:00:00.000Z',
      'yearOfBirth': 2008,
      'medicalConditions': 'None',
      'contactName': 'Finley Watkins',
      'contactMobileNumber': '086 5882764',
      'contactHomeNumber': '021 4834511',
      'contactEmailAddress': 'finley_watkins@gmail.com',
      'school': 'Scoil Mhuire Lourdes',
      'lastRegisteredDate': '2017-02-14T00:00:00.000Z',
      'lastRegisteredYear': 2017,
      'registeredYears': [
        2017
      ],
      '__v': 1,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'playerState': 1
    });

    expect(JSON.stringify(component.selectedPlayer)).toEqual(JSON.stringify({
      '_id': 'b159d6e49a41877180ba3826',
      'firstName': 'Thomas',
      'surname': 'Watkins',
      'addressLine1': '115 Evergreen Lane',
      'addressLine2': 'Richmond',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2008-05-04T00:00:00.000Z',
      'yearOfBirth': 2008,
      'medicalConditions': 'None',
      'contactName': 'Finley Watkins',
      'contactMobileNumber': '086 5882764',
      'contactHomeNumber': '021 4834511',
      'contactEmailAddress': 'finley_watkins@gmail.com',
      'school': 'Scoil Mhuire Lourdes',
      'lastRegisteredDate': '2017-02-14T00:00:00.000Z',
      'lastRegisteredYear': 2017,
      'registeredYears': [
        2017
      ],
      '__v': 1,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'playerState': 1
    }));
  });

  it('should download CSV of current filter', () => {
    spyOn(playersService, 'downloadCSV')

    component.filterForm.controls['nameFilter'].setValue('o');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    component.onClickDownloadCSV();

    expect(playersService.downloadCSV).toHaveBeenCalledWith([
      {
        'surname': 'Love',
        'firstName': 'Joshua',
        'addressLine1': '4032 Heliport Loop',
        'addressLine2': 'Gold Cliff',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2008-06-20',
        'lastRegisteredDate': '2018-02-04',
        'medicalConditions': '',
        'contactName': 'Dilan Love',
        'contactEmailAddress': 'dilan_love@hotmail.com',
        'contactMobileNumber': '087 4765397',
        'contactHomeNumber': '021 9445529',
        'school': 'Gaelscoil',
      },
      {
        'surname': 'Watkins',
        'firstName': 'Thomas',
        'addressLine1': '115 Evergreen Lane',
        'addressLine2': 'Richmond',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2008-05-04',
        'lastRegisteredDate': '2017-02-14',
        'medicalConditions': 'None',
        'contactName': 'Finley Watkins',
        'contactEmailAddress': 'finley_watkins@gmail.com',
        'contactMobileNumber': '086 5882764',
        'contactHomeNumber': '021 4834511',
        'school': 'Scoil Mhuire Lourdes',
      }
    ]);
  });
});
