import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';

import { AlertService } from '../index';


@Component({
  template: 'Mock'
})
class MockComponent {}

describe('AlertService', () => {
  let service: AlertService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: "home", component: MockComponent },
          { path: "away", component: MockComponent }
        ])
      ],
      providers: [
        AlertService
      ]
    });

    router = TestBed.get(Router);
    service = TestBed.get(AlertService);
  });

  it('should return alert stream', () => {
    expect(service.getAlertStream).toEqual(jasmine.any(Subject));
  });

  it('should fire error event', () => {
    service.getAlertStream.subscribe(
      alert => {
        expect(alert).toEqual({
          type: 'error', 
          title: 'Error Header', 
          text: 'Error message'
        });
      });

    service.error('Error Header', 'Error message');
  });

  it('should fire success event', () => {
    service.getAlertStream.subscribe(
      alert => {
        expect(alert).toEqual({
          type: 'success', 
          title: 'Success Header', 
          text: 'Success message'
        });
      });

    service.success('Success Header', 'Success message');
  });

  it('should clear alert after navigation change', fakeAsync(() => {
    let localAlert: any = null;

    service.getAlertStream.subscribe(
      alert => {
        localAlert = alert;
      });

    service.error('Error Header', 'Error message');

    router.navigate(['/home']);

    expect(localAlert).toBeUndefined();
  }));

  it('should keep alert after navigation change', fakeAsync(() => {
    let localAlert: any = null;

    service.getAlertStream.subscribe(
      alert => {
        localAlert = alert;
      });

    service.success('Success Header', 'Success message', true);

    router.navigate(['/home']);

    expect(localAlert).toEqual({
      type: 'success', 
      title: 'Success Header', 
      text: 'Success message'
    });
  }));

  it('should clear alert after second navigation change', fakeAsync(() => {
    let localAlert: any = null;

    service.getAlertStream.subscribe(
      alert => {
        localAlert = alert;
      });

    service.success('Success Header', 'Success message', true);

    router.navigate(['/home']);
    tick();

    router.navigate(['/away']);
    tick();

    expect(localAlert).toBeUndefined();
  }));
});