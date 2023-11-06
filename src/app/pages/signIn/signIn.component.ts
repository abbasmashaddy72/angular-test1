import { NotifierService } from 'angular-notifier';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss'],
})
export class SignInComponent implements OnInit {
  private readonly notifier: NotifierService;
  login: any = {
    username: '',
    password: '',
  };

  constructor(
    private authenticationService: AuthenticationService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {}

  onClickSubmit(loginForm: any) {
    if (this.login.username == '' || this.login.password == '') {
      this.notifier.notify(
        'error',
        'User Name & Password Should not be empty!'
      );
      return false;
    }
    this.authenticationService.login(this.login.username, this.login.password);
  }
}
