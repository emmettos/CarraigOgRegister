export interface ICoach {
  id: number;

	firstName: string;
	surname: string;
	emailAddress: string;
	phoneNumber: string;
	administrator: boolean;

  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;

  version: string;
}

export interface ICoachRole {
  groupName: string;
  role: string;
}
