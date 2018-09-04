export interface IPlayer {
  _id: string;

  playerState: PlayerState;

  firstName: string;
  surname: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  yearOfBirth: number;
  dateOfBirth: string;
  medicalConditions: string;
  contactName: string;
  contactMobileNumber: string;
  contactHomeNumber: string;
  contactEmailAddress: string;
  school: string;
  lastRegisteredDate: string;
  lastRegisteredYear: number;
  registeredYears: number[];

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  __v: number;
}

export enum PlayerState {
  Existing,
  Missing,
  New
}
