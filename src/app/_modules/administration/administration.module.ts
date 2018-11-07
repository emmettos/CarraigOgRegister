import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdministrationRoutingModule } from './administration-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";
import { ManageCoachesComponent } from './_components/manage-coaches/manage-coaches.component';
import { CoachFormComponent } from './_components/coach-form/coach-form.component';
import { ConfirmDeleteCoachComponent } from './_components/confirm-delete-coach/confirm-delete-coach.component';


@NgModule({
  declarations: [
    ManagePlayersComponent,
    ManageCoachesComponent,
    CoachFormComponent,
    ConfirmDeleteCoachComponent
  ],
  imports: [
    AdministrationRoutingModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    CoachFormComponent,
    ConfirmDeleteCoachComponent
  ]
})
export class AdministrationModule { }
