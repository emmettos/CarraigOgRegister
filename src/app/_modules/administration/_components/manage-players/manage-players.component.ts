import { 
  Component, 
  ComponentRef,
  ElementRef,
  OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { APP_SETTINGS } from '../../../../_helpers/app.initializer.helper';
import { IPlayer } from '../../../../_models/index';
import { PlayersService } from '../../../../_services/index';
import { AlertService, ValidationService } from '../../../../_modules/shared/_services/index';


@Component({
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.css']
})
export class ManagePlayersComponent implements OnInit {
  managePlayersForm: FormGroup;

  groupYears: any[] = null;

  dateOfBirthMinDate: NgbDateStruct;
  dateOfBirthMaxDate: NgbDateStruct;
  dateOfBirthStartDate: any;
  
  resetDateOfBirth: boolean = true;

  groupPlayers: IPlayer[] = null;
  matchedPlayers: IPlayer[] = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private playersService: PlayersService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this.groupYears = APP_SETTINGS.groupYears;
    this.groupYears.unshift('Select Year');

    this.managePlayersForm = this.formBuilder.group({
      'groupYear': ['Select Year', this.validationService.groupYearValidator]
    });
  }

  onChangeGroupYear(groupYear: string) {
    this.resetDateOfBirth = !this.resetDateOfBirth;
    this.groupPlayers = null;

    if (groupYear !== 'Select Year') {
      this.playersService.readAllPlayers(+groupYear)
        .subscribe(
          response => {
            let playerIndex = 0;

            this.groupPlayers = response.body.players;
          },
          errorResponse => {
            console.error(errorResponse);

            this.alertService.error(errorResponse.message, errorResponse.error.error.message);
          });

      this.dateOfBirthMinDate = { year: +groupYear, month: 1, day: 1 };
      this.dateOfBirthMaxDate = { year: +groupYear, month: 12, day: 31 };

      this.dateOfBirthStartDate = { year: +groupYear, month: 6 };
    }
  }

  onSubmit() {
    let dateOfBirthValue = this.managePlayersForm.get('datePickerTextBox').value,
        dateOfBirth = new Date(Date.UTC(+dateOfBirthValue.year, +dateOfBirthValue.month - 1, +dateOfBirthValue.day));

    this.matchedPlayers = this.groupPlayers
      .filter(
        player => {
          let playerDateOfBirth = new Date(player.dateOfBirth);
          
          return dateOfBirth.getTime() === playerDateOfBirth.getTime();
        });
  }
}
