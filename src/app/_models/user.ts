export interface IUser {
  _id: string;

  userState: UserState;

	firstName: string;
	surname: string;
	emailAddress: string;
	phoneNumber: string;
	isAdministrator: boolean;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  __v: number;
}

export enum UserState {
  Active,
  Dormant
}
