export interface IPlayer {
  _id: string,

  playerState: PlayerState

  firstName: string,
  surname: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  dateOfBirth: Date,
  medicalConditions: string,
  contactName: string,
  contactMobileNumber: string,
  contactHomeNumber: string,
  contactEmailAddress: string,
  school: string,
  lastRegisteredDate: Date,
  lastRegisteredYear: number,
  registeredYears: number[]
}

export enum PlayerState {
  Existing,
  Missing,
  New
}
