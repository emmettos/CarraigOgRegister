import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoach } from '../../../../_models/index';
import { CoachesService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { CoachFormComponent } from './coach-form.component';


describe('CoachFormComponent', () => {
  let component: CoachFormComponent;
  let fixture: ComponentFixture<CoachFormComponent>;

  let coachDetails: ICoach = {
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
    'active': false
  };

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

  it('should update new coach form value', () => {
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

  it('should update edit coach form value', () => {
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
});
