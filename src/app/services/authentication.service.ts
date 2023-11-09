import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthenticationClient } from '../api/authenticationClient.api'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'token'

  constructor (
    private authenticationClient: AuthenticationClient,
    private router: Router
  ) {}

  public login (username: string, password: string): Observable<string> {
    return this.authenticationClient.login(username, password)
  }

  public register (username: string, email: string, password: string): void {
    this.authenticationClient
      .register(username, email, password)
      .subscribe(token => {
        localStorage.setItem(this.tokenKey, token)
        this.router.navigate(['admin/dashboard'])
      })
  }

  public logout () {
    localStorage.removeItem(this.tokenKey)
    this.router.navigate(['sign-in'])
  }

  public isLoggedIn (): boolean {
    let token = localStorage.getItem(this.tokenKey)
    return token != null && token.length > 0
  }

  public checkLogin () {
    if (['/sign-in', '/sign-up'].includes(this.router.url)) {
      if (this.isLoggedIn()) {
        this.router.navigate(['admin/dashboard'])
      }
    }
  }

  public getToken (): string | null {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null
  }
}
