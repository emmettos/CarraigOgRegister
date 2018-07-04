import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePlayersComponent } from "./_components/manage-players/manage-players.component";
import { PageNotFoundComponent } from "../shared/_components/page-not-found/page-not-found.component";


const routes: Routes = [
  { path: "manage-players", component: ManagePlayersComponent },
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
