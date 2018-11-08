import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of, asyncScheduler } from 'rxjs';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlayer, ICoach } from '../../../../_models/index';
import { CoachesService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { ConfirmDeleteCoachComponent } from './confirm-delete-coach.component';


describe('ConfirmDeleteCoachComponent', () => {
  let component: ConfirmDeleteCoachComponent;
  let fixture: ComponentFixture<ConfirmDeleteCoachComponent>;

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

    component['coachDetails'] = {
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
    } as ICoach;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
