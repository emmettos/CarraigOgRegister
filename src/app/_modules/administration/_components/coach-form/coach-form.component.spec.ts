import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../../../../_models/index';
import { CoachesService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { CoachFormComponent } from './coach-form.component';


describe('CoachFormComponent', () => {
  let component: CoachFormComponent;
  let fixture: ComponentFixture<CoachFormComponent>;

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
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachFormComponent);
    component = fixture.componentInstance;

    coachesService = TestBed.get(CoachesService);
    activeModal = TestBed.get(NgbActiveModal);

    coachDetails = {
      '_id': '6293c9a83fd22e7fa8e66d3f',
      'firstName': 'Erick',
      'surname': 'Norris',
      'emailAddress': 'erick_norris@carraigog.com',
      'phoneNumber': '086 6095372',
      'isAdministrator': true,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedDate': '2018-05-09T09:55:59.735Z',
      'updatedBy': 'administrator@carraigog.com',
      '__v': 0,
      'active': true
    };  
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

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Edit Coach - erick_norris@carraigog.com');
  });

  it('should initialize new coach emailAddress field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['emailAddress'].value).toEqual('');
  });

  it('should initialize edit coach emailAddress field', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(component.coachForm.controls['emailAddress'].value).toEqual('erick_norris@carraigog.com');
  });

  it('should initialize new coach first name field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['firstName'].value).toEqual('');
  });

  it('should initialize edit coach first name field', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(component.coachForm.controls['firstName'].value).toEqual('Erick');
  });

  it('should initialize new coach surname field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['surname'].value).toEqual('');
  });

  it('should initialize edit coach surname field', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(component.coachForm.controls['surname'].value).toEqual('Norris');
  });

  it('should initialize new coach phoneNumber field', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['phoneNumber'].value).toEqual('');
  });

  it('should initialize edit coach phoneNumber field', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(component.coachForm.controls['phoneNumber'].value).toEqual('086 6095372');
  });

  it('should initialize new coach isAdministrator checkbox', () => {
    fixture.detectChanges();

    expect(component.coachForm.controls['isAdministrator'].value).toBeFalsy();
  });

  it('should initialize edit coach isAdministrator checkbox', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(component.coachForm.controls['isAdministrator'].value).toBeTruthy();
  });

  it('should update form value in new coach mode', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('user@test.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('User');
    component.coachForm.controls['phoneNumber'].setValue('087 2233441');
    component.coachForm.controls['isAdministrator'].setValue(true);

    expect(component.coachForm.value).toEqual({
      emailAddress: 'user@test.com',
      firstName: 'Test',
      surname: 'User',
      phoneNumber: '087 2233441',
      isAdministrator: true
    });
  });

  it('should update form value in edit coach mode', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('User');
    component.coachForm.controls['phoneNumber'].setValue('087 2233441');
    component.coachForm.controls['isAdministrator'].setValue(true);

    expect(component.coachForm.value).toEqual({
      firstName: 'Test',
      surname: 'User',
      phoneNumber: '087 2233441',
      isAdministrator: true
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

    component.coachForm.controls['surname'].setValue('Player');
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

  it('should validate valid email', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('user@test.com');
    expect(component.coachForm.controls['emailAddress'].invalid).toBeFalsy();
  });

  it('should initialize email address group to be visible', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#email-address-group').hidden).toBeFalsy();  
  });

  it('should initialize email address group to be hidden', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#email-address-group').hidden).toBeTruthy();  
  });

  it('should disable submit button for invalid form', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('user@test.com');
    component.coachForm.controls['firstName'].setValue('Test');
    component.coachForm.controls['surname'].setValue('User');
    component.coachForm.controls['phoneNumber'].setValue('087 2233441');
    component.coachForm.controls['isAdministrator'].setValue(true);

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy()  
  });

  it('should read email address when saving a player', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.emailAddress).toEqual('test@gmail.com');
  });

  it('should read first name when saving a player', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.firstName).toEqual('FirstName');
  });

  it('should read surname when saving a player', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.surname).toEqual('Surname');
  });

  it('should read phone number when saving a player', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    component.coachForm.controls['phoneNumber'].setValue('087 7654321');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.phoneNumber).toEqual('087 7654321');
  });

  it('should read isAdministrator when saving a player', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    component.coachForm.controls['isAdministrator'].setValue('true');

    fixture.detectChanges();

    component.onSubmit(component.coachForm.value);

    expect(component.coachDetails.isAdministrator).toBeTruthy();
  });

  it('should call coachesService.updateCoach when updating a coach', () => {
    component['coachDetails'] = coachDetails;

    fixture.detectChanges();

    component.coachForm.controls['isAdministrator'].setValue('true');

    fixture.detectChanges();

    spyOn(coachesService, 'updateCoach')
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
              'active': false
            },
            {
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
              'active': true
            }
          ]
        }
      }));

    component.onSubmit(component.coachForm.value);

    expect(coachesService.updateCoach).toHaveBeenCalled();
  });

  it('should call coachesService.createCoach when adding a new coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    spyOn(coachesService, 'createCoach')
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
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'FirstName',
              'surname': 'Surname',
              'emailAddress': 'test@gmail.com',
              'phoneNumber': '',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        }
      }));

    component.onSubmit(component.coachForm.value);

    expect(coachesService.createCoach).toHaveBeenCalled();
  });

  it('should set savingCoach to true after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();
    
    spyOn(coachesService, 'createCoach')
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
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'FirstName',
              'surname': 'Surname',
              'emailAddress': 'test@gmail.com',
              'phoneNumber': '',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        }
      }, asyncScheduler));

    component.onSubmit(component.coachForm.value);

    expect(component.savingCoach).toBeTruthy();
  });

  it('should call activeModal.close after successfully creating a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    spyOn(coachesService, 'createCoach')
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
              'active': false
            },
            {
              '_id': '6293c9a83fd22e7fa8e66d3f',
              'firstName': 'FirstName',
              'surname': 'Surname',
              'emailAddress': 'test@gmail.com',
              'phoneNumber': '',
              'isAdministrator': false,
              'createdBy': 'script',
              'createdDate': '2017-03-15T13:43:51.268Z',
              'updatedDate': '2018-05-09T09:55:59.735Z',
              'updatedBy': 'administrator@carraigog.com',
              '__v': 0,
              'active': true
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.coachForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      coachDetails: { 
        emailAddress: 'test@gmail.com', 
        firstName: 'FirstName', 
        surname: 'Surname', 
        phoneNumber: '', 
        isAdministrator: false 
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
          'active': false
        },
        {
          '_id': '6293c9a83fd22e7fa8e66d3f',
          'firstName': 'FirstName',
          'surname': 'Surname',
          'emailAddress': 'test@gmail.com',
          'phoneNumber': '',
          'isAdministrator': false,
          'createdBy': 'script',
          'createdDate': '2017-03-15T13:43:51.268Z',
          'updatedDate': '2018-05-09T09:55:59.735Z',
          'updatedBy': 'administrator@carraigog.com',
          '__v': 0,
          'active': true
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to create a coach', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');

    fixture.detectChanges();

    spyOn(coachesService , 'createCoach')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.coachForm.value);

    expect(activeModal.dismiss).toHaveBeenCalledWith({
      coachDetails: { 
        emailAddress: 'test@gmail.com', 
        firstName: 'FirstName', 
        surname: 'Surname', 
        phoneNumber: '', 
        isAdministrator: false 
      },
      error: 'Fake error'
    });
  });

  it('should call activeModal.close after successfully editing a coach', () => {
    component.coachDetails = coachDetails;

    fixture.detectChanges();

    component.coachForm.controls['isAdministrator'].setValue(false);

    fixture.detectChanges();

    spyOn(coachesService, 'updateCoach')
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
              'active': false
            },
            {
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
              'active': true
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.coachForm.value);

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
        'active': true
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
          'active': false
        },
        {
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
          'active': true
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to edit a coach', () => {
    component.coachDetails = coachDetails;

    fixture.detectChanges();

    component.coachForm.controls['isAdministrator'].setValue(false);

    fixture.detectChanges();

    spyOn(coachesService , 'updateCoach')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');

    component.onSubmit(component.coachForm.value);

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
        'active': true
      },
      error: 'Fake error'
    })
  });

  it('should disable email address field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-email-address').disabled).toBeTruthy();  
  });

  it('should disable first name field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-first-name').disabled).toBeTruthy();  
  });

  it('should disable surname field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-surname').disabled).toBeTruthy();  
  });

  it('should disable phone number field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#coach-phone-number').disabled).toBeTruthy();  
  });

  it('should disable isAdministrator field after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    expect(fixture.nativeElement.querySelector('#is-administrator').disabled).toBeTruthy();  
  });

  it('should disable reset button after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable save player button after submitting a coach to be saved', () => {
    fixture.detectChanges();

    component.coachForm.controls['emailAddress'].setValue('test@gmail.com');
    component.coachForm.controls['firstName'].setValue('FirstName');
    component.coachForm.controls['surname'].setValue('Surname');
    
    component.onSubmit(component.coachForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
