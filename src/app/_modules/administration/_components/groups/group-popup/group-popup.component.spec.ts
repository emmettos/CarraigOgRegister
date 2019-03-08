import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { GroupPopupComponent } from './group-popup.component';


describe('GroupPopupComponent', () => {
  let component: GroupPopupComponent;
  let fixture: ComponentFixture<GroupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        GroupPopupComponent 
      ],
      imports: [
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPopupComponent);
    component = fixture.componentInstance;

    component.groupDetails = {
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

    component.footballCoachFullName = 'John Rees';
    component.hurlingCoachFullName = 'Byrok Moran';
    component.numberOfPlayers = 19;
    component.lastUpdatedDate = '2018-07-26T16:29:25.372Z';
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set header style for active group', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-success')).toEqual('');
  });

  it('should set header style for dormant group', () => {
    component.numberOfPlayers = 0;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-header').style.getPropertyValue('bg-warning')).toEqual('');
  });

  it('should display name', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#name").innerHTML).toEqual('Under 6');
  });

  it('should display year of birth', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#year-of-birth").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Year of Birth:</strong> 2010');
  });

  it('should display football coach', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#football-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Football Coach:</strong> John Rees');
  });

  it('should display hurling coach', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#hurling-coach").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Hurling Coach:</strong> Byrok Moran');
  });

  it('should display number of players', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#number-of-players").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Number of Players:</strong> 19');
  });

  it('should display players last updated date', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#last-updated-date").innerHTML).toMatch('^<strong _ngcontent-c\\d+="">Players Last Updated:</strong> 26/07/2018 4:29 PM');
  });

  it('should set header style for active group', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-success-light')).toEqual('');
  });

  it('should set header style for dormant group', () => {
    component.numberOfPlayers = 0;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.card-footer').style.getPropertyValue('bg-warning-light')).toEqual('');
  });

  it('should display created by', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-by").innerHTML).toEqual('Created By: script');
  });

  it('should display created date', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#created-date").innerHTML).toEqual('Created Date: 15/03/2017 1:43 PM');
  });

  it('should display updated by', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-by").innerHTML).toEqual('Updated By: admin@carraigog.com');
  });
  
  it('should display updated date', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#updated-date").innerHTML).toEqual('Updated Date: 13/02/2018 10:21 AM');
  });
});
