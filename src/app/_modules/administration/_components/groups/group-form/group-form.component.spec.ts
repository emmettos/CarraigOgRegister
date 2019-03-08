import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../../_helpers/index';
import { IGroup } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { GroupFormComponent } from './group-form.component';


describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;

  APP_SETTINGS.yearsOfBirth = [2013, 2012, 2011, 2010];

  let groupsService: GroupsService,
      activeModal: NgbActiveModal;

  let groupDetails: IGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        GroupFormComponent 
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        GroupsService,
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
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;

    groupsService = TestBed.get(GroupsService);
    activeModal = TestBed.get(NgbActiveModal);

    groupDetails = {
      'id': 2,
      'yearId': 2,
      'yearOfBirth': 2010,      
      'name': 'Under 6',
      'footballCoachId': 1,
      'hurlingCoachId': 2,
      'createdBy': 'script',
      'createdDate': '2017-03-15T13:43:51.268Z',
      'updatedBy': 'admin@carraigog.com',
      'updatedDate': '2018-02-13T10:21:40.545Z',
      'version': '2018-03-04T10:20:00.000Z',
    };

    component['coaches'] = [
      {
        'id': 1,
        'firstName': 'Administrator',
        'surname': '',
        'emailAddress': 'admin@carraigog.com',
        'phoneNumber': '086 1550344',
        'administrator': true,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'version': '2018-05-09T09:55:59.735Z'
      },
      {
        'id': 2,
        'firstName': 'Lachlan',
        'surname': 'Johnson',
        'emailAddress': 'lachlan_johnson@carraigog.com',
        'phoneNumber': '086 4449465',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'version': '2018-05-09T09:55:59.735Z'
      },
      {
        'id': 3,
        'firstName': 'Erick',
        'surname': 'Norris',
        'emailAddress': 'erick_norris@carraigog.com',
        'phoneNumber': '086 6095372',
        'administrator': false,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-05-09T09:55:59.735Z',
        'version': '2018-05-09T09:55:59.735Z'
      }
    ];
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize add new group title', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Add New Group');
  });

  it('should initialize edit group title', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#title").innerHTML).toEqual('Edit Group');
  });

  it('should set header style for existing group with players', () => {
    component['groupDetails'] = groupDetails;
    component['numberOfPlayers'] = 10;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for existing group with no players', () => {
    component['groupDetails'] = groupDetails;
    component['numberOfPlayers'] = 0;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should set header style for new group', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-header').style.getPropertyValue('bg-info')).toEqual('');
  });

  it('should initialize years of birth option 1', () => {
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('#year-of-birth-select').options[0].text).toEqual('Select Year');  
  });

  it('should initialize year of birth value option 1', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').options[0].value).toEqual('0');  
  });

  it('should initialize years of birth option 3', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').options[2].text).toEqual('2012');  
  });

  it('should initialize years of birth value option 2', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').options[1].value).toEqual('1: 2013');  
  });

  it('should initialize football coach option 1', () => {
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('#football-coach-select').options[0].text).toEqual('Select Coach');  
  });

  it('should initialize football coach value option 1', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#football-coach-select').options[0].value).toEqual('0');  
  });

  it('should initialize football coach option 3', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#football-coach-select').options[2].text).toEqual('Lachlan Johnson');  
  });

  it('should initialize football coach value option 2', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#football-coach-select').options[1].value).toEqual('1: 1');  
  });

  it('should initialize new group name field', () => {
    fixture.detectChanges();

    expect(component.groupForm.controls['name'].value).toEqual('');
  });

  it('should initialize edit group name field', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(component.groupForm.controls['name'].value).toEqual('Under 6');
  });

  it('should initialize new group year of birth field', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').value).toEqual('0');  
  });

  it('should initialize edit group year of birth field', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').value).toEqual('4: 2010');  
  });

  it('should initialize new group football coach field', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#football-coach-select').value).toEqual('0');  
  });

  it('should initialize edit group football coach field', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#football-coach-select').value).toEqual('1: 1');  
  });

  it('should initialize new group hurling coach field', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#hurling-coach-select').value).toEqual('0');  
  });

  it('should initialize edit group hurling coach field', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#hurling-coach-select').value).toEqual('2: 2');  
  });

  it('should update form value in new group mode', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    component.groupForm.controls['footballCoach'].setValue(1);
    component.groupForm.controls['hurlingCoach'].setValue(3);

    expect(component.groupForm.value).toEqual({
      name: 'Test',
      yearOfBirth: 2012,
      footballCoach: 1,
      hurlingCoach: 3
    });
  });

  it('should update form value in edit group mode', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    component.groupForm.controls['footballCoach'].setValue(1);
    component.groupForm.controls['hurlingCoach'].setValue(3);

    expect(component.groupForm.value).toEqual({
      name: 'Test',
      yearOfBirth: 2012,
      footballCoach: 1,
      hurlingCoach: 3
    });
  });

  it('should validate invalid name', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('');
    
    expect(component.groupForm.controls['name'].invalid).toBeTruthy();
  });

  it('should validate valid first name', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    
    expect(component.groupForm.controls['name'].invalid).toBeFalsy();
  });

  it('should validate invalid year of birth', () => {
    fixture.detectChanges();

    component.groupForm.controls['yearOfBirth'].setValue('0');
    
    expect(component.groupForm.controls['yearOfBirth'].invalid).toBeTruthy();
  });

  it('should validate valid year of birth', () => {
    fixture.detectChanges();

    component.groupForm.controls['yearOfBirth'].setValue(2012);
    
    expect(component.groupForm.controls['yearOfBirth'].invalid).toBeFalsy();
  });

  it('should disable submit button for invalid form', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });

  it('should enable submit button for valid form', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeFalsy()  
  });

  it('should read name when saving a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(component.groupDetails.name).toEqual('Test');
  });

  it('should read year of birth when saving a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(component.groupDetails.yearOfBirth).toEqual(2012);
  });

  it('should read football coach when saving a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    component.groupForm.controls['footballCoach'].setValue(1);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(component.groupDetails.footballCoachId).toEqual(1);
  });

  it('should read hurling coach when saving a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    component.groupForm.controls['hurlingCoach'].setValue(3);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(component.groupDetails.hurlingCoachId).toEqual(3);
  });

  it('should call groupsService.updateGroup when updating a group', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    spyOn(groupsService, 'updateGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(groupsService.updateGroup).toHaveBeenCalledWith(groupDetails);
  });

  it('should call groupsService.createGroup when creating a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }));

    component.onSubmit(component.groupForm.value);

    expect(groupsService.createGroup).toHaveBeenCalledWith({
      'name': 'Test',
      'yearOfBirth': 2012,
      'footballCoachId': null,
      'hurlingCoachId': null
    });
  });

  it('should call activeModal.close after successfully creating a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();

    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: [
            {
              'id': 2,
              'yearOfBirth': 2010,      
              'name': 'Under 6',
              'version': '2018-03-04T10:20:00.000Z',
              'footballCoachFullName': 'Erick Norris',
              'hurlingCoachFullName': 'Lachlan Johnson',
              'numberOfPlayers': 15,
              'lastUpdatedDate': '2018-02-13T10:21:40.545Z',
            },
            {
              'id': 3,
              'yearOfBirth': 2012,
              'name': 'Test',
              'version': '2018-03-04T10:20:00.000Z',
              'footballCoachFullName': null,
              'hurlingCoachFullName': null,
              'numberOfPlayers': 0,
              'lastUpdatedDate': null,
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.groupForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      groupDetails: { 
        'name': 'Test',
        'yearOfBirth': 2012,
        'footballCoachId': null,
        'hurlingCoachId': null
      },
      updatedGroups: [
        {
          'id': 2,
          'yearOfBirth': 2010,      
          'name': 'Under 6',
          'version': '2018-03-04T10:20:00.000Z',
          'footballCoachFullName': 'Erick Norris',
          'hurlingCoachFullName': 'Lachlan Johnson',
          'numberOfPlayers': 15,
          'lastUpdatedDate': '2018-02-13T10:21:40.545Z',
        },
        {
          'id': 3,
          'yearOfBirth': 2012,
          'name': 'Test',
          'version': '2018-03-04T10:20:00.000Z',
          'footballCoachFullName': null,
          'hurlingCoachFullName': null,
          'numberOfPlayers': 0,
          'lastUpdatedDate': null,
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to create a group', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();

    spyOn(groupsService , 'createGroup')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.groupForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should call activeModal.close after successfully editing a group', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Under 6xxx');

    fixture.detectChanges();

    spyOn(groupsService, 'updateGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: [
            {
              'id': 2,
              'yearOfBirth': 2010,      
              'name': 'Under 6xxx',
              'version': '2018-03-04T10:20:00.000Z',
              'footballCoachFullName': 'Erick Norris',
              'hurlingCoachFullName': 'Lachlan Johnson',
              'numberOfPlayers': 15,
              'lastUpdatedDate': '2018-02-13T10:21:40.545Z',
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.groupForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      groupDetails: { 
        'id': 2,
        'yearId': 2,
        'yearOfBirth': 2010,      
        'name': 'Under 6xxx',
        'footballCoachId': 1,
        'hurlingCoachId': 2,
        'createdBy': 'script',
        'createdDate': '2017-03-15T13:43:51.268Z',
        'updatedBy': 'admin@carraigog.com',
        'updatedDate': '2018-02-13T10:21:40.545Z',
        'version': '2018-03-04T10:20:00.000Z',
      },
      updatedGroups: [
        {
          'id': 2,
          'yearOfBirth': 2010,      
          'name': 'Under 6xxx',
          'version': '2018-03-04T10:20:00.000Z',
          'footballCoachFullName': 'Erick Norris',
          'hurlingCoachFullName': 'Lachlan Johnson',
          'numberOfPlayers': 15,
          'lastUpdatedDate': '2018-02-13T10:21:40.545Z'
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to edit a group', () => {
    component['groupDetails'] = groupDetails;

    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('XXX');

    fixture.detectChanges();

    spyOn(groupsService , 'updateGroup')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');

    component.onSubmit(component.groupForm.value);

    expect(activeModal.dismiss).toHaveBeenCalled();
  });

  it('should disable name field after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    expect(fixture.nativeElement.querySelector('#name').disabled).toBeTruthy();  
  });

  it('should disable year of birth field after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    expect(fixture.nativeElement.querySelector('#year-of-birth-select').disabled).toBeTruthy();  
  });

  it('should disable football coach field after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    expect(fixture.nativeElement.querySelector('#football-coach-select').disabled).toBeTruthy();  
  });

  it('should disable hurling coach field after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);

    fixture.detectChanges();
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    expect(fixture.nativeElement.querySelector('#hurling-coach-select').disabled).toBeTruthy();  
  });

  it('should disable cancel button after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable save button after submitting a group to be saved', () => {
    fixture.detectChanges();

    component.groupForm.controls['name'].setValue('Test');
    component.groupForm.controls['yearOfBirth'].setValue(2012);
    
    spyOn(groupsService, 'createGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.groupForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
