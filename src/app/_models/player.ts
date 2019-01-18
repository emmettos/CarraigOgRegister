export interface IPlayer {
  id: number;

  firstName: string;
  surname: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  dateOfBirth: string;
  medicalConditions: string;
  contactName: string;
  contactMobileNumber: string;
  contactHomeNumber: string;
  contactEmailAddress: string;
  school: string;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  version: number;
}
