import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdministrationRoutingModule } from './administration-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ManagePlayersComponent } from "./_components/players/manage-players/manage-players.component";
import { ManageCoachesComponent } from './_components/coaches/manage-coaches/manage-coaches.component';
import { CoachFormComponent } from './_components/coaches/coach-form/coach-form.component';
import { ConfirmDeleteCoachComponent } from './_components/coaches/confirm-delete-coach/confirm-delete-coach.component';
import { CoachPopupComponent } from './_components/coaches/coach-popup/coach-popup.component';
import { ManageGroupsComponent } from './_components/groups/manage-groups/manage-groups.component';
import { GroupFormComponent } from './_components/groups/group-form/group-form.component';
import { GroupPopupComponent } from './_components/groups/group-popup/group-popup.component';
import { PlayerPopupComponent } from './_components/players/player-popup/player-popup.component';


@NgModule({
  declarations: [
    ManagePlayersComponent,
    PlayerPopupComponent,
    ManageCoachesComponent,
    CoachFormComponent,
    ConfirmDeleteCoachComponent,
    CoachPopupComponent,
    ManageGroupsComponent,
    GroupFormComponent,
    GroupPopupComponent
  ],
  imports: [
    AdministrationRoutingModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    PlayerPopupComponent,
    CoachFormComponent,
    ConfirmDeleteCoachComponent,
    CoachPopupComponent,
    GroupFormComponent,
    GroupPopupComponent
  ]
})
export class AdministrationModule { }
