import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { ToasterModule, ToasterService } from 'angular2-toaster';

import { SharedModule } from './_modules/shared/shared.module';

import { readConfigurationSettings, HttpInterceptorHelper } from './_helpers/index';

import { AuthorizationGuard, LoginGuard } from './_guards/index';
import { 
  AuthorizationService, 
  ConfigurationService,
  GroupsService,
  UserService, 
  PlayersService } from './_services/index';
  
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { GroupsListComponent } from './_components/groups-list/groups-list.component';
import { GroupThumbnailComponent } from './_components/group-thumbnail/group-thumbnail.component';
import { NavComponent } from './_components/nav/nav.component';
import { PlayersListComponent } from './_components/players-list/players-list.component';


@NgModule({
  declarations: [
    AppComponent,
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
    AuthorizationService,
    ConfigurationService,
    GroupsService,
    PlayersService,
    ToasterService,
    UserService,
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
