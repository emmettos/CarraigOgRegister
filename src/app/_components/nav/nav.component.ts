import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { AuthorizationService } from '../../_services/index';


@Component({
  selector: 'app-nav',
  styleUrls: ['./nav.component.css'],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  navbarCollapsed: boolean = true;

  constructor(
    public authorizationService: AuthorizationService,
    private toasterService: ToasterService,
    private router: Router) { 
  }

  onClickLogout() {
    if (!this.authorizationService.getActivePayload) {
      this.toasterService.pop('warning', 'Your session had expired', 'Goodbye');
    }
    else {
      this.toasterService.pop('success', 'Successfully Signed Out', 'Goodbye');
    }

    this.authorizationService.deleteToken();
    
    this.router.navigate(['/login']);
  }
}
