import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../_services/index';
import { IUserProfile } from '../_models/index';


@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private toasterService: ToasterService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authorizationService.getPayload) {
      this.toasterService.pop('warning', 'Unauthorized Access', 'Please login');

      this.router.navigate(['/login'], { queryParams : { return: state.url } });
      
      return false;
    }

    if (!this.authorizationService.getActivePayload) {
      this.authorizationService.deleteToken();
      
      this.toasterService.pop('warning', 'Your Session has Expired', 'Please login');

      this.router.navigate(['/login'], { queryParams : { return: state.url } });
      
      return false;
    }

    if (state.url === '/administration/manage-players') {
      if (!this.authorizationService.getActivePayload.userProfile.isAdministrator) {
        this.toasterService.pop('warning', 'Unauthorized Access', 'Administrator access only');

        this.router.navigate(['/groups']);

        return false;
      }
    }
    else {
      if (/^\/players\/(?:[^%]|%[0-9A-Fa-f]{2})+\/2[0-9]{3}$/.test(state.url)) {
        let userProfile: IUserProfile = this.authorizationService.getActivePayload.userProfile;

        if (!userProfile.isAdministrator) { 
          if (!(userProfile.isManager && userProfile.groups.find(group => group === +route.url[2].path))) {
            this.toasterService.pop('warning', 'Unauthorized Access', 'Group Manager access only');

            this.router.navigate(['/groups']);
    
            return false;  
          }
        }
      }
    }

    return true;
  }
}