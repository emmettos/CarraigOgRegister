import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard, LoginGuard } from './_guards/index';
import { GroupsListComponent } from "./_components/groups-list/groups-list.component";
import { LoginComponent } from "./_components/login/login.component";
import { PlayersListComponent } from "./_components/players-list/players-list.component";


const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "groups", component: GroupsListComponent, canActivate: [AuthorizationGuard] },
  { path: "players/:groupName/:yearOfBirth", component: PlayersListComponent, canActivate: [AuthorizationGuard] },
  { path: "administration", loadChildren: "app/_modules/administration/administration.module#AdministrationModule" },
  { path: "", redirectTo: "/login", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
