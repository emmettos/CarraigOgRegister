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

    spyOnProperty(applicationErrorHandlerService, 'getErrorMessage', 'get')
      .and.returnValue('Error message');

    spyOnProperty(applicationErrorHandlerService, 'getStackString', 'get')
      .and.returnValue(of('Stack Trace'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message', () => {
    expect(fixture.nativeElement.querySelector("#error-message").innerHTML).toEqual('Error message');
  });

  it('should display stack trace', () => {
    expect(fixture.nativeElement.querySelector(".stack-trace").innerHTML).toEqual('Stack Trace');
  });
});
