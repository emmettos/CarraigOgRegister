export interface IPlayer {
  _id: string,

  playerState: PlayerState

  firstName: string,
  surname: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  dateOfBirth: string,
  medicalConditions: string,
  contactName: string,
  contactMobileNumber: string,
  contactHomeNumber: string,
  contactEmailAddress: string,
  school: string,
  lastRegisteredDate: string,
  lastRegisteredYear: number,
  registeredYears: number[]

  __v: number;
}

export enum PlayerState {
  Existing,
  Missing,
  New
}
