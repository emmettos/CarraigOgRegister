import { Injectable } from '@angular/core';

import { IPayload } from '../_models/index';


const JWT_KEY = 'carraig-og-register.jwt';

@Injectable()
export class AuthorizationService {
  // This is public so that FakeBackendInterceptorHelper can write to it (easier than faking a JWT).
  payload: IPayload = null;

  constructor() {
    this.parseToken(localStorage.getItem(JWT_KEY));
  }

  get getActivePayload(): IPayload {
    if (this.payload && (new Date()).getTime() <= this.payload.exp * 1000) {
      return this.payload;
    }

    return null;
  }

  get getPayload(): IPayload {
    return this.payload;
  }

  parseToken(token: string, incoming?: boolean) {
    let base64Payload: any = null,
        payload: IPayload = null;
          
    if (token) {
      base64Payload = token.split('.')[1];
      payload = JSON.parse(atob(base64Payload.replace('-', '+').replace('_', '/')));

      if (incoming) {
        if ((new Date()).getTime() <= payload.exp * 1000) {
          this.payload = payload;
          localStorage.setItem(JWT_KEY, token);
        }
      }
      else {
        this.payload = payload;
      }
    }
  }

  readToken() {
    return localStorage.getItem(JWT_KEY);
  }

  deleteToken() {
    this.payload = null;
    localStorage.removeItem(JWT_KEY);
  }
}
