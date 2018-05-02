export interface IGroup {
  canViewPlayers: boolean;

  name: string;
  yearOfBirth: number;

  footballManager: string;
  hurlingManager: string;

  numberOfPlayers: number;

  lastUpdatedDate: Date;
}
