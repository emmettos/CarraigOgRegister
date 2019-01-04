import { Component, Input, OnInit } from '@angular/core';

import { AuthorizationService } from '../../_services/authorization.service';
import { IGroupOverview, IUserProfile } from '../../_models/index';


@Component({
  selector: 'app-group-thumbnail',
  templateUrl: './group-thumbnail.component.html',
  styleUrls: ['./group-thumbnail.component.css']
})
export class GroupThumbnailComponent implements OnInit {
  @Input() groupOverview: IGroupOverview;
  
  constructor(private authorizationService: AuthorizationService) { 
  }

  ngOnInit() {
    let userProfile: IUserProfile = this.authorizationService.getActivePayload.userProfile;

    this.groupOverview.canViewPlayers = false;

    if (userProfile.isAdministrator) {
      this.groupOverview.canViewPlayers = true;
    }
    else if (userProfile.isManager) {
      let groupIndex = 0,
          groupFound = false;

      while (groupIndex < userProfile.groups.length && !groupFound) {
        if (userProfile.groups[groupIndex++] === this.groupOverview.id) {
          this.groupOverview.canViewPlayers = true;

          groupFound = true;
        }
      }
    }
  }
}
