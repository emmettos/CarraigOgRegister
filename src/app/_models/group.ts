export interface IGroup {
  id: number;

  yearId: number;
  yearOfBirth: number;
  name: string;
  footballCoachId: number;
  hurlingCoachId: number;

  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;

  version: string;
}
