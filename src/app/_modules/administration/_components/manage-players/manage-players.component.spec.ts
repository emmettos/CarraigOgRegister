import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../_helpers/index';

import { PlayersService } from '../../../../_services';
import { ValidationService } from '../../../../_modules/shared/_services';

import { DatePickerComponent } from '../../../../_modules/shared/_components/date-picker/date-picker.component';
import { ManagePlayersComponent } from './manage-players.component';


class MockHttpClient {
  get() {}
  post() {}
}

describe('ManagePlayersComponent', () => {
  let component: ManagePlayersComponent;
  let fixture: ComponentFixture<ManagePlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DatePickerComponent,
        ManagePlayersComponent 
      ],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      providers: [
        { 
          provide: HttpClient, 
          UseClass: MockHttpClient 
        },
        PlayersService,
        ValidationService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlayersComponent);
    component = fixture.componentInstance;

    APP_SETTINGS.currentYear = 2018;
    APP_SETTINGS.groupYears = [ 2008, 2009, 2010, 2011, 2012, 2013 ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
