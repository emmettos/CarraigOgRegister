import { Injectable } from '@angular/core';

import { IPayload } from '../_models/index';


@Injectable()
export class AuthorizationService {
  private payload: IPayload = null;

  constructor() {
    this.parseToken(localStorage["carraig_og_jwt_token"]);
  }

  get getActivePayload(): IPayload {
    if (this.payload && (new Date()).getTime() <= +this.payload.exp * 1000) {
      return this.payload;
    }

    return null;
  }

  get getPayload(): IPayload {
    return this.payload;
  }

  deleteToken() {
    this.payload = null;
    localStorage.removeItem("carraig_og_jwt_token");
  }

  parseToken(token: string, incoming?: boolean) {
    let base64Payload: any = null,
        payload: IPayload = null;
          
    if (token) {
      base64Payload = token.split(".")[1];
      payload = JSON.parse(atob(base64Payload.replace("-", "+").replace("_", "/")));

      if (incoming) {
        if ((new Date()).getTime() <= +payload.exp * 1000) {
          this.payload = payload;
          localStorage["carraig_og_jwt_token"] = token;
        }
      }
      else {
        this.payload = payload;
      }
    }
  }

  readToken() {
    return localStorage["carraig_og_jwt_token"];
  }
}
