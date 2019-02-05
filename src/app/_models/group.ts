export interface IGroup {
  id: number;

  yearId: number;
  yearOfBirth: number;
  name: string;
  footballCoachId: number;
  hurlingCoachId: number;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  version: string;
}
