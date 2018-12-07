export interface IGroup {
  _id: string;

  name: string,
  yearOfBirth: number,
  footballManager: string,
  hurlingManager: string,

  lastUpdatedDate: string,

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  __v: number;
}
