export interface ICoach {
  _id: string;

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

  active: boolean;
  currentSessionOwner: boolean;  
}
