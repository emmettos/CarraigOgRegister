import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../_services/index';

import { IPayload } from '../_models/index';


@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private toasterService: ToasterService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let payload: IPayload = null;

    if (!this.authorizationService.getPayload)
    {
      this.toasterService.pop('warning', '[G]  Access', 'Please Login');

      this.router.navigate(['/login'], { queryParams : { return: state.url } });
      
      return false;
    }

    if (!this.authorizationService.getActivePayload) {
      this.authorizationService.deleteToken();
      
      this.toasterService.pop('warning', '[G] Your session has expired', 'Please Login');

      this.router.navigate(['/login'], { queryParams : { return: state.url } });
      
      return false;    
    }

    if (state.url == '/manage-players') {
      if (!this.authorizationService.getPayload.userProfile.isAdministrator) {
        this.toasterService.pop('warning', 'Unauthorized Access', 'Administrator access only');

        this.router.navigate(['/home']);

        return false;
      }
    }

    return true;
  }
}