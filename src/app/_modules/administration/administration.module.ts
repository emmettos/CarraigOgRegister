import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdministrationRoutingModule } from './administration-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";
import { AppModule } from '../../app.module';


@NgModule({
  imports: [
    AdministrationRoutingModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ManagePlayersComponent
  ],
})
export class AdministrationModule { }
