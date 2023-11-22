import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NotifierService } from 'angular-notifier'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss']
})
export class SignInComponent implements OnInit {
  private tokenKey = 'token'
  private readonly notifier: NotifierService
  login: any = {
    username: '',
    password: ''
  }

  constructor (
    private authenticationService: AuthenticationService,
    private router: Router,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService
  }

  ngOnInit () {
    this.authenticationService.checkLogin()
  }

  onClickSubmit (loginForm: any) {
    if (this.login.username === '' || this.login.password === '') {
      this.notifier.notify('error', 'User Name & Password Should not be empty!')
      return
    }

    this.authenticationService
      .login(this.login.username, this.login.password)
      .subscribe(
        (token: any) => {
          if (token && token.objresult && token.objresult.accessKey) {
            localStorage.setItem(this.tokenKey, token.objresult.accessKey)
            this.router.navigate(['admin/dashboard'])
          }
        },
        error => {
          console.error('Login error:', error)
          this.notifier.notify(
            'error',
            'Login failed. Please check your credentials.'
          )
        }
      )
  }
}
