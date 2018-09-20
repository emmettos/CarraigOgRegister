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

    spyOnProperty(alertService, 'getAlertStream', 'get')
      .and.returnValue(subject);
      
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display alert when no alert', () => {
    expect(fixture.nativeElement.querySelector("#alert-panel")).toBeNull();
  });

  it('should display alert when alert exists', () => {
    subject.next({ type: 'error', title: "Alert Title", text: "Alert Message" });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("#alert-panel")).toBeTruthy();
  });

  it('should display alert title', () => {
    subject.next({ type: 'error', title: "Alert Title", text: "Alert Message" });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector("#alert-title").innerHTML).toEqual('Alert Title');
  });

  it('should display alert text', () => {
    subject.next({ type: 'error', title: "Alert Title", text: "Alert Message" });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector("#alert-text").innerHTML).toEqual('Alert Message');
  });

  it('should display success alert', () => {
    subject.next({ type: 'success', title: "Alert Title", text: "Alert Message" });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector("#alert-panel").style.getPropertyValue('alert-success')).toEqual('');
  });

  it('should display error alert', () => {
    subject.next({ type: 'error', title: "Alert Title", text: "Alert Message" });

    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector("#alert-panel").style.getPropertyValue('alert-danger')).toEqual('');
  });
});
