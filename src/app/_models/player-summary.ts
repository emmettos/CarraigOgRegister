export interface IPlayerSummary {
  id: number,
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
  playerState: PlayerState;
}

export enum PlayerState {
  Existing,
  New,
  Missing
}
