import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../../../../_models/index';
import { CoachesService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { ConfirmDeleteCoachComponent } from './confirm-delete-coach.component';


describe('ConfirmDeleteCoachComponent', () => {
  let component: ConfirmDeleteCoachComponent;
  let fixture: ComponentFixture<ConfirmDeleteCoachComponent>;

  let coachesService: CoachesService,
      activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ConfirmDeleteCoachComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        CoachesService,
        ValidationService,
        NgbActiveModal
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteCoachComponent);
    component = fixture.componentInstance;

    coachesService = TestBed.get(CoachesService);
    activeModal = TestBed.get(NgbActiveModal);

    component['coachDetails'] = {
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'isAdministrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true,
      'currentSessionOwner': false
    } as ICoach;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display coach email address', () => {
    expect(fixture.nativeElement.querySelector('#coach-email-address').innerHTML).toEqual('erick_norris@carraigog.com');  
  });

  it('should initialize new coach send goodbye email checkbox', () => {
    fixture.detectChanges();

    expect(component.deleteCoachForm.controls['sendGoodbyeEmail'].value).toBeFalsy();
  });

  it('should update form value', () => {
    component.deleteCoachForm.controls['sendGoodbyeEmail'].setValue(true);

    expect(component.deleteCoachForm.value).toEqual({
      sendGoodByeEmail: true
    });
  });

  it('should call coachesService.deleteCoach when deleting a coach', () => {
    component.deleteCoachForm.controls['sendGoodbyeEmail'].setValue(true);

    spyOn(coachesService, 'deleteCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false,
              'currentSessionOwner': true
            }
          ]
        }
      }));

    component.onSubmit(component.deleteCoachForm.value);

    expect(coachesService.deleteCoach).toHaveBeenCalledWith({
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true,
        'currentSessionOwner': false
      }, true);
  });

  it('should set deletingCoach to true after submitting a coach to be deleted', () => {
    spyOn(coachesService, 'deleteCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false,
              'currentSessionOwner': true
            }
          ]
        }
      }, asyncScheduler));

    component.onSubmit(component.deleteCoachForm.value);

    expect(component.deletingCoach).toBeTruthy();
  });

  it('should call activeModal.close after successfully deleting a coach', () => {
    spyOn(coachesService, 'deleteCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: [
            {
              '_id': 'b093d6d273adfb49ae33e6e1',
              'firstName': 'Administrator',
              'surname': '',
              'emailAddress': 'admin@carraigog.com',
              'phoneNumber': '086 1550344',
              'isAdministrator': true,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': false,
              'currentSessionOwner': true
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.deleteCoachForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      coachDetails: { 
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true,
        'currentSessionOwner': false
        },
      updatedCoaches: [
        {
          '_id': 'b093d6d273adfb49ae33e6e1',
          'firstName': 'Administrator',
          'surname': '',
          'emailAddress': 'admin@carraigog.com',
          'phoneNumber': '086 1550344',
          'isAdministrator': true,
          'createdBy': 'script',
          'createdDate': '2017-03-15T13:43:51.268Z',
          'updatedDate': '2018-05-09T09:55:59.735Z',
          'updatedBy': 'administrator@carraigog.com',
          '__v': 0,
          'active': false,
          'currentSessionOwner': true
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to delete a coach', () => {
    spyOn(coachesService , 'deleteCoach')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.deleteCoachForm.value);

    expect(activeModal.dismiss).toHaveBeenCalledWith({
      coachDetails: { 
        '_id': '6293c9a83fd22e7fa8e66d3f',
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'isAdministrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'updatedBy': 'administrator@carraigog.com',
        '__v': 0,
        'active': true,
        'currentSessionOwner': false
      },
      error: 'Fake error'
    });
  });

  it('should disable sendGoodbyeEmail field after submitting a coach to be deleted', () => {
    component.onSubmit(component.deleteCoachForm.value);

    expect(fixture.nativeElement.querySelector('#send-goodbye-email').disabled).toBeTruthy();  
  });

  it('should disable cancel button after submitting a coach to be deleted', () => {
    component.onSubmit(component.deleteCoachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable Ok button after submitting a coach to be deleted', () => {
    component.onSubmit(component.deleteCoachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
