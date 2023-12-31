import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from './../services/authentication.service'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor (public authenticationService: AuthenticationService) {}
  intercept (
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authenticationService.isLoggedIn()) {
      let newRequest = request.clone({
        setHeaders: {
          Authorization: `${this.authenticationService.getToken().accessKey}`
        }
      })
      return next.handle(newRequest)
    }
    return next.handle(request)
  }
}
