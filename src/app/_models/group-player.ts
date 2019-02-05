export interface IGroupPlayer {
  id: number;

  groupId: number;
  playerId: number;

  registeredDate: string;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  version: string;
}
