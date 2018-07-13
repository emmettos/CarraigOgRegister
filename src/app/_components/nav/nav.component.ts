import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizationService } from '../../_services/index';


@Component({
  selector: 'app-nav',
  styleUrls: ['./nav.component.css'],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  navbarCollapsed: boolean = true;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router) { 
  }

  onClickLogout() {
    this.authorizationService.deleteToken();
    
    this.router.navigate(['/login']);
  }
}
