import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from '../../_guards/index';
import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";
import { ManageCoachesComponent } from "./_components/coaches/manage-coaches/manage-coaches.component";
import { ManageGroupsComponent } from "./_components/groups/manage-groups/manage-groups.component";
import { PageNotFoundComponent } from "../shared/_components/page-not-found/page-not-found.component";


const routes: Routes = [
  { path: "manage-players", component: ManagePlayersComponent, canActivate: [AuthorizationGuard]  },
  { path: "manage-coaches", component: ManageCoachesComponent, canActivate: [AuthorizationGuard]  },
  { path: "manage-groups", component: ManageGroupsComponent, canActivate: [AuthorizationGuard]  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdministrationRoutingModule { }
