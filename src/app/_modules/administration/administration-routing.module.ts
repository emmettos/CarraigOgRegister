import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from '../../_guards/index';
import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";
import { ManageUsersComponent } from "./_components/manage-users/manage-users.component";
import { PageNotFoundComponent } from "../shared/_components/page-not-found/page-not-found.component";


const routes: Routes = [
  { path: "manage-players", component: ManagePlayersComponent, canActivate: [AuthorizationGuard]  },
  { path: "manage-users", component: ManageUsersComponent, canActivate: [AuthorizationGuard]  },
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
