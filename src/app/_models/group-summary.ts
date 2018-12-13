export interface IGroupSummary {
  canViewPlayers: boolean;

  name: string;
  yearOfBirth: number;

  footballCoachFullName: string;
  hurlingCoachFullName: string;

  numberOfPlayers: number;

  lastUpdatedDate: string;
}
