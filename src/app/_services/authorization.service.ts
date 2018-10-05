import { Injectable } from '@angular/core';

import { IPayload } from '../_models/index';


@Injectable()
export class AuthorizationService {
  // This is public so that FakeBackendInterceptorHelper can write to it (easier that faking a JWT).
  payload: IPayload = null;

  constructor() {
    this.parseToken(localStorage.getItem('carraig-og-register.jwt'));
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
          localStorage.setItem('carraig-og-register.jwt', token);
        }
      }
      else {
        this.payload = payload;
      }
    }
  }

  readToken() {
    return localStorage.getItem('carraig-og-register.jwt');
  }

  deleteToken() {
    this.payload = null;
    localStorage.removeItem('carraig-og-register.jwt');
  }
}
