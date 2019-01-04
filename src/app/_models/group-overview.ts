export interface IGroupOverview {
  id: number;
  
  yearOfBirth: number;
  name: string;

  footballCoachFullName: string;
  hurlingCoachFullName: string;

  numberOfPlayers: number;

  lastUpdatedDate: string;

  canViewPlayers: boolean;
}
