import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { AuthenticationService } from './../services/authentication.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {
  constructor (
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in'])
    }
    return true
  }
}
