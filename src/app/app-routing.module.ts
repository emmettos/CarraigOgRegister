import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard, LoginGuard } from './_guards/index';
import { ErrorComponent } from './_components/error/error.component';
import { GroupsListComponent } from "./_components/groups-list/groups-list.component";
import { LoginComponent } from "./_components/login/login.component";
import { PlayersListComponent } from "./_components/players-list/players-list.component";
import { PageNotFoundComponent } from "./_modules/shared/_components/page-not-found/page-not-found.component";


const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: "groups", component: GroupsListComponent, canActivate: [AuthorizationGuard] },
  { path: "players/:groupName/:yearOfBirth", component: PlayersListComponent, canActivate: [AuthorizationGuard] },
  { path: "administration", loadChildren: "app/_modules/administration/administration.module#AdministrationModule" },
  { path: "error", component: ErrorComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: '**', component: PageNotFoundComponent }
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
