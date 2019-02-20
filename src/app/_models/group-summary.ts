export interface IGroupSummary {
  id: number;

  yearOfBirth: number;
  name: string;
  version: string; 

  footballCoachFullName: string;
  hurlingCoachFullName: string;
  numberOfPlayers: number;
  lastUpdatedDate: string;

  canViewPlayers: boolean;
}
