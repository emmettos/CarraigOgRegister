import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../_helpers/index';
import { PlayersService } from '../../_services';

import { PlayersListComponent } from './players-list.component';


class MockHttpClient {}

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
        HttpClientModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                groupName: 'Under 9',
                yearOfBirth: '2009'
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
              '_id': '58c669deb8a0ebcf9c5b93c9',
              'firstName': 'Jos',
              'surname': 'Keating',
              'addressLine1': 'Leela Hill House',
              'addressLine2': 'KnockNaLurgan',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2009-01-01T00:00:00.000Z',
              'yearOfBirth': 2009,
              'medicalConditions': '',
              'contactName': 'David Keating',
              'contactMobileNumber': '087 6874814',
              'contactHomeNumber': '',
              'contactEmailAddress': 'keatingdavidj@gmail.com',
              'school': '',
              'lastRegisteredDate': '2018-05-08T23:00:00.000Z',
              'lastRegisteredYear': 2018,
              'registeredYears': [
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
              '_id': '58c669deb8a0ebcf9c5b93cb',
              'firstName': 'Charlie',
              'surname': 'Kennedy',
              'addressLine1': '7 The Orchard',
              'addressLine2': 'Herons Wood',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2009-01-01T00:00:00.000Z',
              'yearOfBirth': 2009,
              'medicalConditions': 'None',
              'contactName': 'Shane Kennedy',
              'contactMobileNumber': '086 8104453',
              'contactHomeNumber': '021 4834511',
              'contactEmailAddress': 'shanekennedy7@gmail.com',
              'school': '',
              'lastRegisteredDate': '2018-02-17T00:00:00.000Z',
              'lastRegisteredYear': 2018,
              'registeredYears': [
                  2018
              ],
              '__v': 2,
              'createdBy': 'script',
              'createdDate': '2018-03-15T13:43:51.268Z',
              'updatedDate': '2018-02-23T15:14:53.115Z',
              'updatedBy': 'emmett.j.osullivan@gmail.com'
            },
            {
              '_id': '58c669deb8a0ebcf9c5b93dd',
              'firstName': 'Cian',
              'surname': 'Aherne',
              'addressLine1': 'Cois Dara',
              'addressLine2': 'Raheens',
              'addressLine3': 'Carrigaline',
              'dateOfBirth': '2009-03-20T00:00:00.000Z',
              'yearOfBirth': 2009,
              'medicalConditions': '',
              'contactName': 'Maria Aherne',
              'contactMobileNumber': '087 4128709',
              'contactHomeNumber': '021 4379489',
              'contactEmailAddress': 'mobrien_tara@hotmail.com',
              'school': 'Gaelscoil',
              'lastRegisteredDate': '2017-02-04T00:00:00.000Z',
              'lastRegisteredYear': 2017,
              'registeredYears': [
                  2016,
                  2017
              ],
              '__v': 1,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2017-04-13T14:38:36.668Z',
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
    expect(component.groupName).toEqual('Under 9');
  });

  it('should call playersService.readCurrentPlayers', () => {
    expect(playersService.readCurrentPlayers).toHaveBeenCalled();
  });

  it('should pass yearOfBirth to playersService.readCurrentPlayers', () => {
    expect(playersService.readCurrentPlayers).toHaveBeenCalledWith(2009);
  });

  it('should display total count', () => {
    expect(fixture.nativeElement.querySelector('#total-count').innerHTML).toEqual('Total 2');
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
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Aherne');
  });

  it('should display first name', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(2) > td:nth-child(3)').innerHTML).toEqual('Jos');
  });

  it('should display address line 2', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(4)').innerHTML).toEqual('Herons Wood');
  });

  it('should display date of birth', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(5)').innerHTML).toEqual('20/03/2009');
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
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML).toEqual('Aherne');
  });

  it('should default sort by surname (last player)', () => {
    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(2)').innerHTML).toEqual('Kennedy');
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

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML).toEqual('04/02/2017');
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

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(1) > td:nth-child(3)').innerHTML).toEqual('Jos');
  });

  it('should flip existing sort (last player)', () => {
    component.onClickHeader('firstName');

    fixture.detectChanges();

    component.onClickHeader('firstName');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#players-table > tbody > tr:nth-child(3) > td:nth-child(3)').innerHTML).toEqual('Charlie');
  });

  it('should display currently registered players', () => {
    component.filterForm.controls['currentlyRegistered'].setValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#players-table > tbody > tr').length).toEqual(2);
  });

  it('should filter on player name', () => {
    component.filterForm.controls['nameFilter'].setValue('Jos');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('#players-table > tbody > tr').length).toEqual(1);
  });

  it('should display filter message', () => {
    component.filterForm.controls['nameFilter'].setValue('C');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#displaying-message').innerHTML).toEqual('Displaying 2 Players');
  });

  it('should display selected player details', () => {
    let modalService: NgbModal;

    modalService = TestBed.get(NgbModal);

    spyOn(modalService, 'open');

    component.onClickRow(null, '58c669deb8a0ebcf9c5b93c9');

    expect(JSON.stringify(component.selectedPlayer)).toEqual(JSON.stringify({
      '_id': '58c669deb8a0ebcf9c5b93c9',
      'firstName': 'Jos',
      'surname': 'Keating',
      'addressLine1': 'Leela Hill House',
      'addressLine2': 'KnockNaLurgan',
      'addressLine3': 'Carrigaline',
      'dateOfBirth': '2009-01-01T00:00:00.000Z',
      'yearOfBirth': 2009,
      'medicalConditions': '',
      'contactName': 'David Keating',
      'contactMobileNumber': '087 6874814',
      'contactHomeNumber': '',
      'contactEmailAddress': 'keatingdavidj@gmail.com',
      'school': '',
      'lastRegisteredDate': '2018-05-08T23:00:00.000Z',
      'lastRegisteredYear': 2018,
      'registeredYears': [
          2017,
          2018
      ],
      '__v': 1,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'emmett.j.osullivan@gmail.com',
      'playerState': 0
    }));
  });

  it('should download CSV of current filter', () => {
    spyOn(playersService, 'downloadCSV')

    component.filterForm.controls['nameFilter'].setValue('C');

    fixture.detectChanges();

    component.filterPlayers(component.filterForm.value);

    fixture.detectChanges();

    component.onClickDownloadCSV();

    expect(playersService.downloadCSV).toHaveBeenCalledWith([
      {
        'surname': 'Aherne',
        'firstName': 'Cian',
        'addressLine1': 'Cois Dara',
        'addressLine2': 'Raheens',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-03-20',
        'lastRegisteredDate': '2017-02-04',
        'medicalConditions': '',
        'contactName': 'Maria Aherne',
        'contactMobileNumber': '087 4128709',
        'contactHomeNumber': '021 4379489',
        'contactEmailAddress': 'mobrien_tara@hotmail.com',
        'school': 'Gaelscoil'
      },
      {
        'surname': 'Kennedy',
        'firstName': 'Charlie',
        'addressLine1': '7 The Orchard',
        'addressLine2': 'Herons Wood',
        'addressLine3': 'Carrigaline',
        'dateOfBirth': '2009-01-01',
        'lastRegisteredDate': '2018-02-17',
        'medicalConditions': 'None',
        'contactName': 'Shane Kennedy',
        'contactEmailAddress': 'shanekennedy7@gmail.com',
        'contactMobileNumber': '086 8104453',
        'contactHomeNumber': '021 4834511',
        'school': ''
      }
    ]);
  });
});
