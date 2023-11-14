import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { NotifierService } from 'angular-notifier'
import { BehaviorSubject, Observable, map, tap } from 'rxjs'
import { AuthenticationClient } from '../api/authenticationClient.api'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'token'
  private readonly notifier: NotifierService
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  )

  constructor (
    private authenticationClient: AuthenticationClient,
    private router: Router,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService
  }

  public login (username: string, password: string): Observable<string> {
    return this.authenticationClient.login(username, password).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(true)
      }),
      map((response: any) => {
        if (JSON.parse(response).status === '200') {
          localStorage.setItem(
            this.tokenKey,
            JSON.stringify(JSON.parse(response).objresult)
          )
          this.router.navigate(['admin/dashboard'])
        } else {
          this.handleLoginError(response)
        }
        return response
      })
    )
  }

  private handleLoginError (response: any): void {
    if (response.status === '-200') {
      this.notifier.notify('error', 'Please enter a username/email address')
    } else {
      this.notifier.notify('error', response.message)
    }
    this.isAuthenticatedSubject.next(false)
  }

  public logout () {
    localStorage.removeItem(this.tokenKey)
    this.isAuthenticatedSubject.next(false) // Notify subscribers about the logout
    this.router.navigate(['sign-in'])
  }

  public isLoggedIn (): boolean {
    const token = localStorage.getItem(this.tokenKey)
    return token != null && token.length > 0
  }

  public checkLogin () {
    if (this.isLoggedIn()) {
      if (this.router.url === '/sign-in') {
        this.router.navigate(['admin/dashboard'])
      }
    }
  }

  public isAuthenticated$ (): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable()
  }

  public getToken (): any | null {
    return this.isLoggedIn()
      ? JSON.parse(
          JSON.parse(JSON.stringify(localStorage.getItem(this.tokenKey)))
        )
      : null
  }
}
