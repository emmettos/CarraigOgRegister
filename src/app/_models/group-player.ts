export interface IGroupPlayer {
  id: string;

  groupId: number;
  playerId: number;

  registeredDate: string;

  createdBy: string;
  createdDate: string;
  updatedDate: string;
  updatedBy: string;

  version: number;
}
