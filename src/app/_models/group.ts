export interface IGroup {
  _id: string;

  year: number;
  name: string;
  yearOfBirth: number;
  footballCoach: string;
  hurlingCoach: string;

  lastUpdatedDate: string;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  __v: number;

  footballCoachFullName?: string;
  hurlingCoachFullName?: string;
}
