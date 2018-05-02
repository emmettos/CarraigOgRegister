import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { readConfigurationSettings, HttpInterceptorHelper } from './_helpers/index';

import { AuthorizationGuard, LoginGuard } from './_guards/index';
import { 
  AlertService, 
  AuthorizationService, 
  ConfigurationService,
  GroupsService,
  UserService, 
  PlayersService,
  ValidationService } from './_services/index';
  
import { AlertComponent } from './_components/_common/alert/alert.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { GroupsListComponent } from './_components/groups-list/groups-list.component';
import { GroupThumbnailComponent } from './_components/group-thumbnail/group-thumbnail.component';
import { NavComponent } from './_components/nav/nav.component';
import { PlayersListComponent } from './_components/players-list/players-list.component';
import { ValidationMessageComponent } from './_components/_common/validation-message/validation-message.component';


@NgModule({
  declarations: [
    AlertComponent,
    AppComponent,
    GroupsListComponent,
    GroupThumbnailComponent,
    LoginComponent,
    NavComponent,
    PlayersListComponent,
    ValidationMessageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
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
    ValidationService,
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
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
