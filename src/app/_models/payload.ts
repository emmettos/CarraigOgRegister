export interface IPayload {
  userProfile: IUserProfile;
  
  iat: Date;
  exp: Date;
}

export interface IUserProfile {
  ID: string;
  
  isAdministrator: boolean;
  isManager: boolean;

  groups: number[];
}