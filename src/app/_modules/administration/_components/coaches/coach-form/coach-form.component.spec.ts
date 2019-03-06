import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../../_helpers/index';
import { ICoach } from '../../../../../_models/index';
import { CoachesService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { CoachFormComponent } from './coach-form.component';


describe('CoachFormComponent', () => {
  let component: CoachFormComponent;
  let fixture: ComponentFixture<CoachFormComponent>;

  APP_SETTINGS.yearsOfBirth = [2013, 2012, 2011, 2010];

  let coachesService: CoachesService,
      activeModal: NgbActiveModal;

  let coachDetails: ICoach;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CoachFormComponent 
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
      schemas: [ 
        NO_ERRORS_SCHEMA 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachFormComponent);
    component = fixture.componentInstance;

    coachesService = TestBed.get(CoachesService);
    activeModal = TestBed.get(NgbActiveModal);

    coachDetails = {
      'id': 2,
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'administrator': false,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-05-09T09:55:59.735Z'
    };

    component['currentCoaches'] = [
      {
        'id': 2,
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'administrator': false,
        'version': '2018-05-09T09:55:59.735Z',
        'active': true,
        'currentSessionOwner': false
      }
    ];
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize add new coach title', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Add New Coach');
  });

  it('should initialize edit coach title', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Edit Coach');
  });

  it('should set header style for existing active coach', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for existing dormant coach', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = false;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should set header style for new coach', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-info')).toEqual('');
  });

  it('should initialize new coach emailAddress field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['emailAddress'].value).toEqual('');
  });

  it('should initialize edit coach emailAddress field', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(component.coachForm.controls['emailAddress'].value).toEqual('erick_norris@carraigog.com');
  });

  it('should initialize new coach first name field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['firstName'].value).toEqual('');
  });

  it('should initialize edit coach first name field', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(component.coachForm.controls['firstName'].value).toEqual('Erick');
  });

  it('should initialize new coach surname field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['surname'].value).toEqual('');
  });

  it('should initialize edit coach surname field', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(component.coachForm.controls['surname'].value).toEqual('Norris');
  });

  it('should initialize new coach phoneNumber field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['phoneNumber'].value).toEqual('');
  });

  it('should initialize edit coach phoneNumber field', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(component.coachForm.controls['phoneNumber'].value).toEqual('086 6095372');
  });

  it('should initialize new coach administrator checkbox', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['administrator'].value).toBeFalsy();
  });

  it('should initialize edit coach administrator checkbox', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    expect(component.coachForm.controls['administrator'].value).toBeFalsy();
  });

  it('should update form value in new coach mode', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('user@test.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('User');
    component.coachForm.controls['phoneNumber'].setValue('087 2233441');
    component.coachForm.controls['administrator'].setValue(true);

    expect(component.coachForm.value).toEqual({
      emailAddress: 'user@test.com',
      firstName: 'Test',
      surname: 'User',
      phoneNumber: '087 2233441',
      administrator: true
    });
  });

  it('should update form value in edit coach mode', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('user@test.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('User');
    component.coachForm.controls['phoneNumber'].setValue('087 2233441');
    component.coachForm.controls['administrator'].setValue(true);

    expect(component.coachForm.value).toEqual({
      emailAddress: 'user@test.com',
      firstName: 'Test',
      surname: 'User',
      phoneNumber: '087 2233441',
      administrator: true
    });
  });

  it('should validate invalid first name', () => {
    fixture.detectChanges();

    component.coachForm.controls['firstName'].setValue('');
    expect(component.coachForm.controls['firstName'].invalid).toBeTruthy();
  });

  it('should validate valid first name', () => {
    fixture.detectChanges();

    component.coachForm.controls['firstName'].setValue('Test');
    expect(component.coachForm.controls['firstName'].invalid).toBeFalsy();
  });

  it('should validate invalid surname', () => {
    fixture.detectChanges();

    component.coachForm.controls['surname'].setValue('');
    expect(component.coachForm.controls['surname'].invalid).toBeTruthy();
  });

  it('should validate valid surname', () => {
    fixture.detectChanges();

    component.coachForm.controls['surname'].setValue('Coach');
    expect(component.coachForm.controls['surname'].invalid).toBeFalsy();
  });

  it('should validate blank email', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('');
    expect(component.coachForm.controls['emailAddress'].invalid).toBeTruthy();
  });

  it('should validate invalid email', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('badaddress');
    expect(component.coachForm.controls['emailAddress'].invalid).toBeTruthy();
  });

  it('should validate existing coach email', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('erick_norris@carraigog.com');

    expect(component.coachForm.controls['emailAddress'].invalid).toBeTruthy();
  });

  it('should validate valid email', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');

    expect(component.coachForm.controls['emailAddress'].invalid).toBeFalsy();
  });

  it('should disable submit button for invalid form', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy()  
  });

  it('should read email address when saving a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.emailAddress).toEqual('test_coach@gmail.com');
  });

  it('should read first name when saving a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.firstName).toEqual('Test');
  });

  it('should read surname when saving a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.surname).toEqual('Coach');
  });

  it('should read phone number when saving a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    component.coachForm.controls['phoneNumber'].setValue('087 7654321');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.phoneNumber).toEqual('087 7654321');
  });

  it('should read administrator when saving a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    component.coachForm.controls['administrator'].setValue(true);

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.administrator).toBeTruthy();
  });

  it('should call coachesService.updateCoach when updating a coach', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    spyOn(coachesService, 'updateCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }));

    component.onSubmit(component.coachForm.value);

    expect(coachesService.updateCoach).toHaveBeenCalledWith(coachDetails);
  });

  it('should call coachesService.createCoach when creating a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }));

    component.onSubmit(component.coachForm.value);

    expect(coachesService.createCoach).toHaveBeenCalledWith({
      'emailAddress': 'test_coach@gmail.com',
      'firstName': 'Test',
      'surname': 'Coach',
      'phoneNumber': '',
      'administrator': false
    });
  });

  it('should call activeModal.close after successfully creating a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: [
            {
              'id': 2,
              'firstName': 'Erick',
              'surname': 'Norris',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            },
            {
              'id': 3,
              'firstName': 'Test',
              'surname': 'Coach',
              'emailAddress': 'test_coach@gmail.com',
              'phoneNumber': '',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': false,
              'currentSessionOwner': false
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.coachForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      coachDetails: { 
        'emailAddress': 'test_coach@gmail.com',
        'firstName': 'Test',
        'surname': 'Coach',
        'phoneNumber': '',
        'administrator': false
      },
      updatedCoaches: [
        {
          'id': 2,
          'firstName': 'Erick',
          'surname': 'Norris',
          'emailAddress': 'erick_norris@carraigog.com',
          'phoneNumber': '086 6095372',
          'administrator': false,
          'version': '2018-05-09T09:55:59.735Z',
          'active': true,
          'currentSessionOwner': false
        },
        {
          'id': 3,
          'firstName': 'Test',
          'surname': 'Coach',
          'emailAddress': 'test_coach@gmail.com',
          'phoneNumber': '',
          'administrator': false,
          'version': '2018-05-09T09:55:59.735Z',
          'active': false,
          'currentSessionOwner': false
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to create a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    fixture.detectChanges();

    spyOn(coachesService , 'createCoach')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.coachForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should call activeModal.close after successfully editing a coach', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    component.coachForm.controls['surname'].setValue('NorrisXXX');

    fixture.detectChanges();

    spyOn(coachesService, 'updateCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: [
            {
              'id': 2,
              'firstName': 'Erick',
              'surname': 'NorrisXXX',
              'emailAddress': 'erick_norris@carraigog.com',
              'phoneNumber': '086 6095372',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': true,
              'currentSessionOwner': false
            },
            {
              'id': 3,
              'firstName': 'Test',
              'surname': 'Coach',
              'emailAddress': 'test_coach@gmail.com',
              'phoneNumber': '',
              'administrator': false,
              'version': '2018-05-09T09:55:59.735Z',
              'active': false,
              'currentSessionOwner': false
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.coachForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      coachDetails: { 
        'id': 2,
        'firstName': 'Erick',
        'surname': 'NorrisXXX',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-02-13T10:21:40.545Z',
        'version': '2018-05-09T09:55:59.735Z'
      },
      updatedCoaches: [
        {
          'id': 2,
          'firstName': 'Erick',
          'surname': 'NorrisXXX',
          'emailAddress': 'erick_norris@carraigog.com',
          'phoneNumber': '086 6095372',
          'administrator': false,
          'version': '2018-05-09T09:55:59.735Z',
          'active': true,
          'currentSessionOwner': false
        },
        {
          'id': 3,
          'firstName': 'Test',
          'surname': 'Coach',
          'emailAddress': 'test_coach@gmail.com',
          'phoneNumber': '',
          'administrator': false,
          'version': '2018-05-09T09:55:59.735Z',
          'active': false,
          'currentSessionOwner': false
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to edit a coach', () => {
    component['coachDetails'] = coachDetails;
    component['activeCoach'] = true;

    fixture.detectChanges();

    component.coachForm.controls['surname'].setValue('NorrisXXX');

    fixture.detectChanges();

    spyOn(coachesService , 'updateCoach')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');

    component.onSubmit(component.coachForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should disable first name field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    
    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-first-name').disabled).toBeTruthy();  
  });

  it('should disable surname field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    
    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-surname').disabled).toBeTruthy();  
  });

  it('should disable phone number field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    
    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-phone-number').disabled).toBeTruthy();  
  });

  it('should disable administrator field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    
    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#administrator').disabled).toBeTruthy();  
  });

  it('should disable cancel button after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');

    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable save button after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test_coach@gmail.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('Coach');
    
    spyOn(coachesService, 'createCoach')
      .and.returnValue(of({
        "error": null,
        "body": {
          coaches: []
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
