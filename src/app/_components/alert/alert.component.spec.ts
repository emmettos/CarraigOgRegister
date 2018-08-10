import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';

import { SharedModule } from '../../_modules/shared/shared.module';
import { AlertService } from '../../_services';

import { AlertComponent } from './alert.component';


describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertService;
  let subject: Subject<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AlertComponent
      ],
      imports: [
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        AlertService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;

    alertService = TestBed.get(AlertService);    
    subject = new Subject();

    spyOn(alertService, 'getAlert')
      .and.returnValue(subject);
      
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
