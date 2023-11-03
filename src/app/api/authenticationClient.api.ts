import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationClient {
  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<string> {
    return this.http.post(
      Constants.API_ENDPOINT + 'auth/login',
      {
        username: username,
        password: password,
      },
      { responseType: 'text' }
    );
  }

  public register(
    username: string,
    email: string,
    password: string
  ): Observable<string> {
    return this.http.post(
      Constants.API_ENDPOINT + 'user/add',
      {
        username: username,
        email: email,
        password: password,
      },
      { responseType: 'text' }
    );
  }
}
