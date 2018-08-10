import { Component, OnInit } from '@angular/core';

import { APP_SETTINGS } from '../../_helpers/index';
import { IGroup } from '../../_models/index';
import { GroupsService } from '../../_services/index';


@Component({
  styleUrls: ['./groups-list.component.css'],
  templateUrl: './groups-list.component.html'
})
export class GroupsListComponent implements OnInit {
  currentYear: number = 0;
  groups: IGroup[] = null;

  constructor(private groupsService: GroupsService) { 
  }

  ngOnInit() {
    this.currentYear = APP_SETTINGS.currentYear;

    this.groupsService.readGroups()
      .subscribe(
        response => {
          this.groups = response.body.groups;
        });
  }
}
