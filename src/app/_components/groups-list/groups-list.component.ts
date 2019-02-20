import { Component, OnInit } from '@angular/core';

import { APP_SETTINGS } from '../../_helpers/index';
import { IGroupSummary } from '../../_models/index';
import { GroupsService } from '../../_services/index';


@Component({
  styleUrls: ['./groups-list.component.css'],
  templateUrl: './groups-list.component.html'
})
export class GroupsListComponent implements OnInit {
  currentYear: number = 0;
  groupSummaries: IGroupSummary[] = null;

  constructor(private groupsService: GroupsService) { 
  }

  ngOnInit() {
    this.currentYear = APP_SETTINGS.currentYear;

    this.groupsService.readGroupSummaries()
      .subscribe({
        next: response => {
          this.groupSummaries = response.body.groups;
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      });
  }
}
