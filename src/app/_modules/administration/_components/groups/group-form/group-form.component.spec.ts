// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

// import { of, asyncScheduler, throwError } from 'rxjs';

// import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// import { IGroup } from '../../../../../_models/index';
// import { GroupsService } from '../../../../../_services';
// import { ValidationService } from '../../../../../_modules/shared/_services';

// import { GroupFormComponent } from './group-form.component';


// describe('GroupFormComponent', () => {
//   let component: GroupFormComponent;
//   let fixture: ComponentFixture<GroupFormComponent>;

//   let groupsService: GroupsService,
//       activeModal: NgbActiveModal;

//   let groupDetails: IGroup;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ 
//         GroupFormComponent 
//       ],
//       imports: [
//         HttpClientTestingModule,
//         ReactiveFormsModule,
//         NgbModule.forRoot()
//       ],
//       providers: [
//         GroupsService,
//         ValidationService,
//         NgbActiveModal
//       ],
//       schemas: [ NO_ERRORS_SCHEMA ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GroupFormComponent);
//     component = fixture.componentInstance;

//     groupsService = TestBed.get(GroupsService);
//     activeModal = TestBed.get(NgbActiveModal);

//     component.groupDetails = {
//       'id': 1,
//       'yearId': 1,
//       'yearOfBirth': 2009,
//       'name': 'Under 9',
//       'footballCoachId': 1,
//       'hurlingCoachId': 2,
//       'createdBy': 'script',
//       'createdDate': '2017-03-15T13:43:51.268Z',
//       'updatedDate': '2018-07-26T16:29:25.372Z',
//       'updatedBy': 'admin@carraigog.com',
//       'version': 0
//     };

//     component.coaches = [
//       {
//         '_id': 'b093d6d273adfb49ae33e6e1',
//         'firstName': 'Administrator',
//         'surname': '',
//         'emailAddress': 'admin@carraigog.com',
//         'phoneNumber': '086 1550344',
//         'isAdministrator': true,
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-05-09T09:55:59.735Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       },
//       {
//         '_id': '21cfbcbee1da872f1b95dbbf',
//         'firstName': 'Bryok',
//         'surname': 'Moran',
//         'emailAddress': 'bryok_moran@carraigog.com',
//         'phoneNumber': '087 8108797',
//         'isAdministrator': false,
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-05-09T09:55:59.735Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       },
//       {
//         '_id': '6293c9a83fd22e7fa8e66d3f',
//         'firstName': 'Erick',
//         'surname': 'Norris',
//         'emailAddress': 'erick_norris@carraigog.com',
//         'phoneNumber': '086 6095372',
//         'isAdministrator': false,
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-05-09T09:55:59.735Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       },
//       {
//         '_id': 'f346034eb1af16e3845a8dee',
//         'firstName': 'John',
//         'surname': 'Rees',
//         'emailAddress': 'john_rees@carraigog.com',
//         'phoneNumber': '086 1702956',
//         'isAdministrator': false,
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-05-09T09:55:59.735Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       }
//     ];

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize title', () => {
//     expect(fixture.nativeElement.querySelector('#title').innerHTML).toEqual('Edit Group - Under 9');
//   });

//   it('should initialize football coach field', () => {
//     expect(component.groupForm.controls['footballCoach'].value).toEqual('john_rees@carraigog.com');
//   });

//   it('should initialize football coach option 1', () => {
//     expect(fixture.nativeElement.querySelector('#football-coach-select').options[0].text).toEqual('No Coach');  
//   });

//   it('should initialize football coach value option 1', () => {
//     expect(fixture.nativeElement.querySelector('#football-coach-select').options[0].value).toEqual('');  
//   });

//   it('should initialize football coach option 3', () => {
//     expect(fixture.nativeElement.querySelector('#football-coach-select').options[2].text).toEqual('Bryok Moran');  
//   });

//   it('should initialize football coach value option 2', () => {
//     expect(fixture.nativeElement.querySelector('#football-coach-select').options[1].value).toEqual('1: admin@carraigog.com');  
//   });

//   it('should initialize hurling coach field', () => {
//     expect(component.groupForm.controls['hurlingCoach'].value).toEqual('bryok_moran@carraigog.com');
//   });

//   it('should initialize hurling coach option 1', () => {
//     expect(fixture.nativeElement.querySelector('#hurling-coach-select').options[0].text).toEqual('No Coach');  
//   });

//   it('should initialize hurling coach value option 1', () => {
//     expect(fixture.nativeElement.querySelector('#hurling-coach-select').options[0].value).toEqual('');  
//   });

//   it('should initialize hurling coach option 4', () => {
//     expect(fixture.nativeElement.querySelector('#hurling-coach-select').options[3].text).toEqual('Erick Norris');  
//   });

//   it('should initialize hurling coach value option 5', () => {
//     expect(fixture.nativeElement.querySelector('#hurling-coach-select').options[4].value).toEqual('4: john_rees@carraigog.com');  
//   });

//   it('should update form value', () => {
//     component.groupForm.controls['footballCoach'].setValue('erick_norris@carraigog.com');
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     expect(component.groupForm.value).toEqual({
//       footballCoach: 'erick_norris@carraigog.com',
//       hurlingCoach: 'john_rees@carraigog.com'
//     });
//   });

//   it('should read football coach when saving a group', () => {
//     component.groupForm.controls['footballCoach'].setValue('erick_norris@carraigog.com');

//     fixture.detectChanges();

//     component.onSubmit(component.groupForm.value);

//     expect(component.groupDetails.footballCoach).toEqual('erick_norris@carraigog.com');
//   });

//   it('should read hurling coach when saving a group', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     fixture.detectChanges();

//     component.onSubmit(component.groupForm.value);

//     expect(component.groupDetails.hurlingCoach).toEqual('john_rees@carraigog.com');
//   });

//   it('should call groupsService.updateGroup when updating a group', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     fixture.detectChanges();

//     spyOn(groupsService, 'updateGroup')
//       .and.returnValue(of({
//         "error": null,
//         "body": {
//           'groups': [
//             {
//               '_id': 'dfe674827f95ff37765ba0fc',
//               'year': 2018,
//               'name': 'Under 10',
//               'yearOfBirth': 2008,
//               'footballCoach': 'angel_klein@carraigog.com',
//               'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
//               'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-02-27T15:57:21.582Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             },
//             {
//               '_id': '24eef4f773a9cc7b17a539e9',
//               'year': 2018,
//               'name': 'Under 9',
//               'yearOfBirth': 2009,
//               'footballCoach': 'john_rees@carraigog.com',
//               'hurlingCoach': 'john_rees@carraigog.com',
//               'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-07-26T16:29:25.372Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             }
//           ]
//         }
//       }));

//     component.onSubmit(component.groupForm.value);

//     expect(groupsService.updateGroup).toHaveBeenCalled();
//   });

//   it('should set savingGroup to true after submitting a group to be saved', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     fixture.detectChanges();

//     spyOn(groupsService, 'updateGroup')
//       .and.returnValue(of({
//         "error": null,
//         "body": {
//           'groups': [
//             {
//               '_id': 'dfe674827f95ff37765ba0fc',
//               'year': 2018,
//               'name': 'Under 10',
//               'yearOfBirth': 2008,
//               'footballCoach': 'angel_klein@carraigog.com',
//               'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
//               'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-02-27T15:57:21.582Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             },
//             {
//               '_id': '24eef4f773a9cc7b17a539e9',
//               'year': 2018,
//               'name': 'Under 9',
//               'yearOfBirth': 2009,
//               'footballCoach': 'john_rees@carraigog.com',
//               'hurlingCoach': 'john_rees@carraigog.com',
//               'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-07-26T16:29:25.372Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             }
//           ]
//         }
//       }));

//     component.onSubmit(component.groupForm.value);

//     expect(component.savingGroup).toBeTruthy();
//   });

//   it('should call activeModal.close after successfully editing a group', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     fixture.detectChanges();

//     spyOn(groupsService, 'updateGroup')
//       .and.returnValue(of({
//         'error': null,
//         'body': {
//           'groups': [
//             {
//               '_id': 'dfe674827f95ff37765ba0fc',
//               'year': 2018,
//               'name': 'Under 10',
//               'yearOfBirth': 2008,
//               'footballCoach': 'angel_klein@carraigog.com',
//               'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
//               'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-02-27T15:57:21.582Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             },
//             {
//               '_id': '24eef4f773a9cc7b17a539e9',
//               'year': 2018,
//               'name': 'Under 9',
//               'yearOfBirth': 2009,
//               'footballCoach': 'john_rees@carraigog.com',
//               'hurlingCoach': 'john_rees@carraigog.com',
//               'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//               'createdBy': 'script',
//               'createdDate': '2017-03-15T13:43:51.268Z',
//               'updatedDate': '2018-07-26T16:29:25.372Z',
//               'updatedBy': 'admin@carraigog.com',
//               '__v': 0
//             }
//           ]
//         }
//       }));

//     component.onSubmit(component.groupForm.value);

//     spyOn(activeModal, 'close');

//     component.onSubmit(component.groupForm.value);

//     expect(activeModal.close).toHaveBeenCalledWith({
//       groupDetails: { 
//         '_id': '24eef4f773a9cc7b17a539e9',
//         'year': 2018,
//         'name': 'Under 9',
//         'yearOfBirth': 2009,
//         'footballCoach': 'john_rees@carraigog.com',
//         'hurlingCoach': 'john_rees@carraigog.com',
//         'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-07-26T16:29:25.372Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       },
//       updatedGroups: [
//         {
//           '_id': 'dfe674827f95ff37765ba0fc',
//           'year': 2018,
//           'name': 'Under 10',
//           'yearOfBirth': 2008,
//           'footballCoach': 'angel_klein@carraigog.com',
//           'hurlingCoach': 'heddwyn_cunningham@carraigog.com',
//           'lastUpdatedDate': '2018-02-27T15:57:21.582Z',
//           'createdBy': 'script',
//           'createdDate': '2017-03-15T13:43:51.268Z',
//           'updatedDate': '2018-02-27T15:57:21.582Z',
//           'updatedBy': 'admin@carraigog.com',
//           '__v': 0
//         },
//         {
//           '_id': '24eef4f773a9cc7b17a539e9',
//           'year': 2018,
//           'name': 'Under 9',
//           'yearOfBirth': 2009,
//           'footballCoach': 'john_rees@carraigog.com',
//           'hurlingCoach': 'john_rees@carraigog.com',
//           'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//           'createdBy': 'script',
//           'createdDate': '2017-03-15T13:43:51.268Z',
//           'updatedDate': '2018-07-26T16:29:25.372Z',
//           'updatedBy': 'admin@carraigog.com',
//           '__v': 0
//         }
//       ]
//     });
//   });

//   it('should call activeModal.dismiss after failing to edit a coach', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');

//     fixture.detectChanges();

//     spyOn(groupsService , 'updateGroup')
//       .and.callFake(() => {
//         return throwError(new Error('Fake error'));
//       });

//     spyOn(activeModal, 'dismiss');

//     component.onSubmit(component.groupForm.value);

//     expect(activeModal.dismiss).toHaveBeenCalledWith({
//       groupDetails: { 
//         '_id': '24eef4f773a9cc7b17a539e9',
//         'year': 2018,
//         'name': 'Under 9',
//         'yearOfBirth': 2009,
//         'footballCoach': 'john_rees@carraigog.com',
//         'hurlingCoach': 'john_rees@carraigog.com',
//         'lastUpdatedDate': '2018-07-26T16:29:25.372Z',
//         'createdBy': 'script',
//         'createdDate': '2017-03-15T13:43:51.268Z',
//         'updatedDate': '2018-07-26T16:29:25.372Z',
//         'updatedBy': 'admin@carraigog.com',
//         '__v': 0
//       },
//       error: 'Fake error'
//     })
//   });

//   it('should disable football coach field after submitting a group to be saved', () => {
//     component.groupForm.controls['footballCoach'].setValue('john_rees@carraigog.com');
    
//     component.onSubmit(component.groupForm.value);

//     expect(fixture.nativeElement.querySelector('#football-coach-select').disabled).toBeTruthy();  
//   });

//   it('should disable hurling coach field after submitting a group to be saved', () => {
//     component.groupForm.controls['hurlingCoach'].setValue('john_rees@carraigog.com');
    
//     component.onSubmit(component.groupForm.value);

//     expect(fixture.nativeElement.querySelector('#hurling-coach-select').disabled).toBeTruthy();  
//   });

//   it('should disable cancel button after submitting a group to be saved', () => {
//     component.groupForm.controls['footballCoach'].setValue('john_rees@carraigog.com');
    
//     component.onSubmit(component.groupForm.value);

//     fixture.detectChanges();

//     expect(fixture.nativeElement.querySelector('#cancel').disabled).toBeTruthy();  
//   });

//   it('should disable save button after submitting a group to be saved', () => {
//     component.groupForm.controls['footballCoach'].setValue('john_rees@carraigog.com');
    
//     component.onSubmit(component.groupForm.value);

//     fixture.detectChanges();

//     expect(fixture.nativeElement.querySelector('input[type=submit]').disabled).toBeTruthy();  
//   });
// });
