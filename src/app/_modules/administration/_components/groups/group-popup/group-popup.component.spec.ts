// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { SharedModule } from '../../../../shared/shared.module';

// import { GroupPopupComponent } from './group-popup.component';


// describe('GroupPopupComponent', () => {
//   let component: GroupPopupComponent;
//   let fixture: ComponentFixture<GroupPopupComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ 
//         GroupPopupComponent 
//       ],
//       imports: [
//         SharedModule
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GroupPopupComponent);
//     component = fixture.componentInstance;

//     component.groupDetails = {
//       '_id': '6cc1fec86fb94e11121dcf2a',
//       'year': 2018,
//       'name': 'Under 8',
//       'yearOfBirth': 2010,
//       'footballCoach': 'siward_hansen@carraigog.com',
//       'hurlingCoach': 'rowan_love@carraigog.com',
//       'lastUpdatedDate': '2018-02-28T11:22:24.262Z',
//       'createdBy': 'script',
//       'createdDate': '2017-03-15T13:43:51.268Z',
//       'updatedDate': '2018-02-28T11:22:24.262Z',
//       'updatedBy': 'admin@carraigog.com',
//       '__v': 0,
//       'footballCoachFullName': 'Siward Hansen',
//       'hurlingCoachFullName': 'Rowan Love',
//     };

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display name', () => {
//     expect(fixture.nativeElement.querySelector("#name").innerHTML).toEqual('Under 8');
//   });

//   it('should display year of birth', () => {
//     expect(fixture.nativeElement.querySelector("#year-of-birth").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Year of Birth:</strong> 2010');
//   });

//   it('should display football coach', () => {
//     expect(fixture.nativeElement.querySelector("#football-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Football Coach:</strong> Siward Hansen');
//   });

//   it('should display hurling coach', () => {
//     expect(fixture.nativeElement.querySelector("#hurling-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Hurling Coach:</strong> Rowan Love');
//   });

//   it('should display players last updated date', () => {
//     expect(fixture.nativeElement.querySelector("#last-updated-date").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Players Last Updated:</strong> 28/02/2018 11:22 AM');
//   });

//   it('should display created date', () => {
//     expect(fixture.nativeElement.querySelector("#created-date").innerHTML).toEqual('Created Date: 15/03/2017 1:43 PM');
//   });

//   it('should display created by', () => {
//     expect(fixture.nativeElement.querySelector("#created-by").innerHTML).toEqual('Created By: script');
//   });

//   it('should display updated date', () => {
//     expect(fixture.nativeElement.querySelector("#updated-date").innerHTML).toEqual('Updated Date: 28/02/2018 11:22 AM');
//   });

//   it('should display updated by', () => {
//     expect(fixture.nativeElement.querySelector("#updated-by").innerHTML).toEqual('Updated By: admin@carraigog.com');
//   });
// });
