import { ErrorHandler } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ApplicationErrorHandlerService } from '../../_services/index';

import { ErrorComponent } from './error.component';


describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  let applicationErrorHandlerService: ApplicationErrorHandlerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ErrorComponent 
      ],
      providers: [
        { 
          provide: ErrorHandler, 
          useClass: ApplicationErrorHandlerService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;

    applicationErrorHandlerService = TestBed.get(ErrorHandler);

    spyOnProperty(applicationErrorHandlerService, 'getStackString', 'get')
      .and.returnValue(of('Stack String'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
