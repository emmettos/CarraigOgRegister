export interface ICoachSummary {
  id: number;

	firstName: string;
	surname: string;
	emailAddress: string;
	phoneNumber: string;
	administrator: boolean;
  version: string;
  
  active: boolean;
  currentSessionOwner: boolean;
}
