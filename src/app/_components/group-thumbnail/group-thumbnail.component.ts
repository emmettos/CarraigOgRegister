import { Component, Input, OnInit } from '@angular/core';

import { AuthorizationService } from '../../_services/authorization.service';
import { IGroupSummary, IUserProfile } from '../../_models/index';


@Component({
  selector: 'app-group-thumbnail',
  templateUrl: './group-thumbnail.component.html',
  styleUrls: ['./group-thumbnail.component.css']
})
export class GroupThumbnailComponent implements OnInit {
  @Input() 
  groupSummary: IGroupSummary;
  
  constructor(private authorizationService: AuthorizationService) { 
  }

  ngOnInit() {
    let userProfile: IUserProfile = this.authorizationService.getActivePayload.userProfile;

    this.groupSummary.canViewPlayers = false;

    if (userProfile.isAdministrator) {
      this.groupSummary.canViewPlayers = true;
    }
    else if (userProfile.isManager) {
      let groupIndex = 0,
          groupFound = false;

      while (groupIndex < userProfile.groups.length && !groupFound) {
        if (userProfile.groups[groupIndex++] === this.groupSummary.id) {
          this.groupSummary.canViewPlayers = true;

          groupFound = true;
        }
      }
    }
  }

  groupThumbnailCSSClass(group: IGroupSummary) {
    var CSSClass = 'bg-thumbnail-info';

    if (group.numberOfPlayers === 0) {
      CSSClass = 'bg-thumbnail-warning';
    }

    return CSSClass;
  }
}
