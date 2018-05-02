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
export class LoginGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private toasterService: ToasterService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let payload: IPayload = this.authorizationService.getPayload;

    if (payload && (new Date()).getTime() <= +payload.exp * 1000) {
      this.toasterService.pop('success', 'User has an Active Session', 'Redirecting to Home');
      
      this.router.navigate(['/groups']);

      return false;
    }

    return true;
  }
}