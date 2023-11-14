import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Constants } from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationClient {
  constructor (private http: HttpClient) {}

  public login (username: string, password: string): Observable<string> {
    return this.http.post(
      Constants.SAYDAK_API_ENDPOINT +
        Constants.API_VERSION +
        '/login/LoginCheck',
      {
        usersEmailaddress: username,
        usersPassword: password
      },
      { responseType: 'text' }
    )
  }
}
