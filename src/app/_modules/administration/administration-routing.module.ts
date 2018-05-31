import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";


const routes: Routes = [
  { path: "manage-players", component: ManagePlayersComponent },
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
