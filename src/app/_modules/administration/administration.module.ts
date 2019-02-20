import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdministrationRoutingModule } from './administration-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ManagePlayersComponent } from "./_components/players/manage-players/manage-players.component";
import { PlayerPopupComponent } from './_components/players/player-popup/player-popup.component';
import { PlayerFormComponent } from './_components/players/player-form/player-form.component';
import { ConfirmDeletePlayerComponent } from './_components/players/confirm-delete-player/confirm-delete-player.component';
import { ManageCoachesComponent } from './_components/coaches/manage-coaches/manage-coaches.component';
import { CoachFormComponent } from './_components/coaches/coach-form/coach-form.component';
import { ConfirmDeleteCoachComponent } from './_components/coaches/confirm-delete-coach/confirm-delete-coach.component';
import { CoachPopupComponent } from './_components/coaches/coach-popup/coach-popup.component';
import { ManageGroupsComponent } from './_components/groups/manage-groups/manage-groups.component';
import { GroupFormComponent } from './_components/groups/group-form/group-form.component';
import { GroupPopupComponent } from './_components/groups/group-popup/group-popup.component';
import { ConfirmDeleteGroupComponent } from './_components/groups/confirm-delete-group/confirm-delete-group.component';


@NgModule({
  declarations: [
    ManagePlayersComponent,
    PlayerFormComponent,
    PlayerPopupComponent,
    ConfirmDeletePlayerComponent,
    ManageCoachesComponent,
    CoachFormComponent,
    ConfirmDeleteCoachComponent,
    CoachPopupComponent,
    ManageGroupsComponent,
    GroupFormComponent,
    GroupPopupComponent,
    ConfirmDeleteGroupComponent
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
    PlayerFormComponent,
    ConfirmDeletePlayerComponent,
    CoachFormComponent,
    ConfirmDeleteCoachComponent,
    CoachPopupComponent,
    GroupFormComponent,
    GroupPopupComponent,
    ConfirmDeleteGroupComponent
  ]
})
export class AdministrationModule { }
