import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlayerSummary } from '../../../../../_models/index';
import { PlayersService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ConfirmDeletePlayerComponent } from './confirm-delete-player.component';


describe('ConfirmDeletePlayerComponent', () => {
  let component: ConfirmDeletePlayerComponent;
  let fixture: ComponentFixture<ConfirmDeletePlayerComponent>;

  let playersService: PlayersService,
      activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ConfirmDeletePlayerComponent 
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
    fixture = TestBed.createComponent(ConfirmDeletePlayerComponent);
    component = fixture.componentInstance;

    playersService = TestBed.get(PlayersService);
    activeModal = TestBed.get(NgbActiveModal);

    component['playerSummary'] = {
      'id': 1,
      'firstName': 'Michael',
      'surname': 'Wolfe',
      'addressLine1': '830 Green Gate Lane',
      'addressLine2': 'Carrigaline',
      'addressLine3': '',
      'dateOfBirth': '2010-03-03T00:00:00.000Z',
      'yearOfBirth': 2010,
      'medicalConditions': 'Asthma',
      'contactName': 'Moss Wolfe',
      'contactMobileNumber': '087 7128560',
      'contactHomeNumber': '021 9292476',
      'contactEmailAddress': 'moss_wolfe@gmail.com',
      'school': 'Scoil Mhuire Lourdes',
      'version': '2018-02-04T15:13:00.000Z',
      'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
      'playerState': 1
    } as IPlayerSummary;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display player name', () => {
    expect(fixture.nativeElement.querySelector('#player-name').innerHTML).toEqual('Michael Wolfe');  
  });

  it('should call playersService.deletePlayer when deleting a player', () => {
    spyOn(playersService, 'deletePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: [
            {
              'id': 2,
              'firstName': 'Matthew',
              'surname': 'Moss',
              'addressLine1': '179 Payne Street',
              'addressLine2': 'Clear Mount',
              'addressLine3': 'Carrigaline',
              'yearOfBirth': 2010,
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

    component.onSubmit(component.deletePlayerForm.value);

    expect(playersService.deletePlayer).toHaveBeenCalledWith({
      'id': 1,
      'firstName': 'Michael',
      'surname': 'Wolfe',
      'addressLine1': '830 Green Gate Lane',
      'addressLine2': 'Carrigaline',
      'addressLine3': '',
      'dateOfBirth': '2010-03-03T00:00:00.000Z',
      'yearOfBirth': 2010,
      'medicalConditions': 'Asthma',
      'contactName': 'Moss Wolfe',
      'contactMobileNumber': '087 7128560',
      'contactHomeNumber': '021 9292476',
      'contactEmailAddress': 'moss_wolfe@gmail.com',
      'school': 'Scoil Mhuire Lourdes',
      'version': '2018-02-04T15:13:00.000Z',
      'lastRegisteredDate': '2018-02-04T00:00:00.000Z',
      'playerState': 1
    });
  });

  it('should call activeModal.close after successfully deleting a player', () => {
    spyOn(playersService, 'deletePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          players: [
            {
              'id': 2,
              'firstName': 'Matthew',
              'surname': 'Moss',
              'addressLine1': '179 Payne Street',
              'addressLine2': 'Clear Mount',
              'addressLine3': 'Carrigaline',
              'yearOfBirth': 2010,
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

    component.onSubmit(component.deletePlayerForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      matchedPlayers: [
        {
          'id': 2,
          'firstName': 'Matthew',
          'surname': 'Moss',
          'addressLine1': '179 Payne Street',
          'addressLine2': 'Clear Mount',
          'addressLine3': 'Carrigaline',
          'yearOfBirth': 2010,
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

  it('should call activeModal.dismiss after failing to delete a player', () => {
    spyOn(playersService , 'deletePlayer')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.deletePlayerForm.value);

    expect(activeModal.dismiss).toHaveBeenCalledWith();
  });

  it('should disable cancel button after submitting a player to be deleted', () => {
    spyOn(playersService, 'deletePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          matchedPlayers: []
        }
      }, asyncScheduler));

    component.onSubmit(component.deletePlayerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable Ok button after submitting a player to be deleted', () => {
    spyOn(playersService, 'deletePlayer')
      .and.returnValue(of({
        "error": null,
        "body": {
          matchedPlayers: []
        }
      }, asyncScheduler));

    component.onSubmit(component.deletePlayerForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
