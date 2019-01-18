export interface IGroup {
  id: number;

  yearId: number;
  yearOfBirth: number;
  name: string;
  footballCoachId: string;
  hurlingCoachId: string;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  version: number;
}
