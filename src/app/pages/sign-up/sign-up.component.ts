import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { NotifierService } from 'angular-notifier'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  private readonly notifier: NotifierService
  register: any = {
    username: '',
    email: '',
    password: ''
  }

  constructor (
    private authenticationService: AuthenticationService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService
  }

  ngOnInit () {
    this.authenticationService.checkLogin()
  }

  onClickSubmit (registerForm: NgForm) {
    if (
      this.register.username == '' ||
      this.register.email == '' ||
      this.register.password == ''
    ) {
      this.notifier.notify(
        'error',
        'User Name, Email & Password Should not be empty!'
      )
      return
    }
    this.authenticationService.register(
      this.register.username,
      this.register.email,
      this.register.password
    )
  }
}
