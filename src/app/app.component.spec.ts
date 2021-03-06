import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToasterModule } from 'angular2-toaster';

import { AuthorizationService, AlertService } from './_services';

import { AppComponent } from './app.component';
import { NavComponent } from './_components/nav/nav.component';
import { AlertComponent } from './_components/alert/alert.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AlertComponent,
        NavComponent
      ],
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
        ToasterModule.forRoot()
      ],
      providers: [
        AuthorizationService,
        AlertService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
