export interface IGroupSummary {
  canViewPlayers: boolean;

  name: string;
  yearOfBirth: number;

  footballManagerFullName: string;
  hurlingManagerFullName: string;

  numberOfPlayers: number;

  lastUpdatedDate: string;
}
