import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, asyncScheduler, throwError } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroupSummary } from '../../../../../_models/index';
import { GroupsService } from '../../../../../_services';
import { ValidationService } from '../../../../../_modules/shared/_services';

import { ConfirmDeleteGroupComponent } from './confirm-delete-group.component';


describe('ConfirmDeleteGroupComponent', () => {
  let component: ConfirmDeleteGroupComponent;
  let fixture: ComponentFixture<ConfirmDeleteGroupComponent>;

  let groupsService: GroupsService,
      activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ConfirmDeleteGroupComponent 
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
    fixture = TestBed.createComponent(ConfirmDeleteGroupComponent);
    component = fixture.componentInstance;

    groupsService = TestBed.get(GroupsService);
    activeModal = TestBed.get(NgbActiveModal);

    component['groupSummary'] = {
      'id': 1,
      'yearOfBirth': 2009,      
      'name': 'Under 7',
      'version': '2017-02-04T15:13:00.000Z',
      'footballCoachFullName': 'Lachlan Johnson',
      'hurlingCoachFullName': 'Erick Norris',
      'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
    } as IGroupSummary;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display group name', () => {
    expect(fixture.nativeElement.querySelector('#group-name').innerHTML).toEqual('Under 7');  
  });

  it('should call groupsService.deleteGroup when deleting a group', () => {
    spyOn(groupsService, 'deleteGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: [
            {
              'id': 2,
              'yearOfBirth': 2008,      
              'name': 'Under 8',
              'version': '2017-02-04T15:13:00.000Z',
              'footballCoachFullName': 'Kylar Hart',
              'hurlingCoachFullName': 'Sherlock Yang',
              'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
            }
          ]
        }
      }));

    component.onSubmit(component.deleteGroupForm.value);

    expect(groupsService.deleteGroup).toHaveBeenCalledWith({
      'id': 1,
      'yearOfBirth': 2009,      
      'name': 'Under 7',
      'version': '2017-02-04T15:13:00.000Z',
      'footballCoachFullName': 'Lachlan Johnson',
      'hurlingCoachFullName': 'Erick Norris',
      'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
    });
  });

  it('should call activeModal.close after successfully deleting a group', () => {
    spyOn(groupsService, 'deleteGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: [
            {
              'id': 2,
              'yearOfBirth': 2008,      
              'name': 'Under 8',
              'version': '2017-02-04T15:13:00.000Z',
              'footballCoachFullName': 'Kylar Hart',
              'hurlingCoachFullName': 'Sherlock Yang',
              'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
            }
          ]
        }
      }));

    spyOn(activeModal, 'close');

    component.onSubmit(component.deleteGroupForm.value);

    expect(activeModal.close).toHaveBeenCalledWith({
      updatedGroups: [
        {
          'id': 2,
          'yearOfBirth': 2008,      
          'name': 'Under 8',
          'version': '2017-02-04T15:13:00.000Z',
          'footballCoachFullName': 'Kylar Hart',
          'hurlingCoachFullName': 'Sherlock Yang',
          'lastUpdatedDate': '2018-02-04T00:00:00.000Z'
        }
      ]
    });
  });

  it('should call activeModal.dismiss after failing to delete a group', () => {
    spyOn(groupsService , 'deleteGroup')
      .and.callFake(() => {
        return throwError(new Error('Fake error'));
      });

    spyOn(activeModal, 'dismiss');
  
    component.onSubmit(component.deleteGroupForm.value);

    expect(activeModal.dismiss).toHaveBeenCalledWith();
  });

  it('should disable cancel button after submitting a group to be deleted', () => {
    spyOn(groupsService, 'deleteGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.deleteGroupForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
  });

  it('should disable Ok button after submitting a group to be deleted', () => {
    spyOn(groupsService, 'deleteGroup')
      .and.returnValue(of({
        "error": null,
        "body": {
          groups: []
        }
      }, asyncScheduler));

    component.onSubmit(component.deleteGroupForm.value);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
  });
});
