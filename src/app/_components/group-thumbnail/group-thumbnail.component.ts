import { Component, Input, OnInit } from '@angular/core';

import { AuthorizationService } from '../../_services/authorization.service';
import { IGroup, IPayload, IUserProfile } from '../../_models/index';


@Component({
  selector: 'app-group-thumbnail',
  templateUrl: './group-thumbnail.component.html',
  styleUrls: ['./group-thumbnail.component.css']
})
export class GroupThumbnailComponent implements OnInit {
  @Input() group: IGroup;
  
  enum 
  constructor(private authorizationService: AuthorizationService) { 
  }

  ngOnInit() {
    let userProfile: IUserProfile = this.authorizationService.getPayload.userProfile;

    this.group.canViewPlayers = false;

    if (userProfile.isAdministrator) {
      this.group.canViewPlayers = true;
    }
    else if (userProfile.isManager) {
      let groupIndex = 0,
          groupFound = false;

      while (groupIndex < userProfile.groups.length && !groupFound) {
        if (userProfile.groups[groupIndex++] === this.group.yearOfBirth) {
          this.group.canViewPlayers = true;

          groupFound = true;
        }
      }
    }
  }
}
