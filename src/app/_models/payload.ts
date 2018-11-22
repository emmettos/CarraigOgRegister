export interface IPayload {
  userProfile: IUserProfile;
  
  iat: number;
  exp: number;
}

export interface IUserProfile {
  ID: string;
  fullName: string;
  
  isAdministrator: boolean;
  isManager: boolean;

  groups: number[];

  createPasswordProfile: boolean;  
}