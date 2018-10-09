import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { SharedModule } from './_modules/shared/shared.module';
import { readConfigurationSettings, HttpInterceptorHelper, FakeBackendInterceptorHelper } from './_helpers/index';
import { AuthorizationGuard, LoginGuard } from './_guards/index';
import { 
  AlertService,
  ApplicationErrorHandlerService,
  AuthorizationService, 
  ConfigurationService,
  GroupsService,
  UserService, 
  PlayersService } from './_services/index';

import { AlertComponent } from './_components/alert/alert.component';
import { AppComponent } from './app.component';
import { ErrorComponent } from './_components/error/error.component';
import { LoginComponent } from './_components/login/login.component';
import { GroupsListComponent } from './_components/groups-list/groups-list.component';
import { GroupThumbnailComponent } from './_components/group-thumbnail/group-thumbnail.component';
import { NavComponent } from './_components/nav/nav.component';
import { PlayersListComponent } from './_components/players-list/players-list.component';


@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    ErrorComponent,
    GroupsListComponent,
    GroupThumbnailComponent,
    LoginComponent,
    NavComponent,
    PlayersListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    ToasterModule.forRoot()
  ],
  providers: [
    AuthorizationGuard,
    LoginGuard,
    AlertService,
    AuthorizationService,
    ConfigurationService,
    GroupsService,
    PlayersService,
    ToasterService,
    UserService,
    { 
      provide: ErrorHandler, 
      useClass: ApplicationErrorHandlerService 
    },
    {
      provide: APP_INITIALIZER,
      useFactory: readConfigurationSettings,
      deps: [ConfigurationService],
      multi: true
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpInterceptorHelper, 
      multi: true 
    },
    // Uncomment the below HTTP_INTERCEPTOR to use to application with a fake backend.
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: FakeBackendInterceptorHelper,
    //   multi: true
    // }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
