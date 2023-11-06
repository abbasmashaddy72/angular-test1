import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  register: any = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {}

  onClickSubmit(registerForm: NgForm) {
    if (this.register.username == '' || this.register.password == '') {
      alert('User Name & Password Should not be empty');
      return false;
    }
    this.authenticationService.register(
      this.register.username,
      this.register.email,
      this.register.password
    );
  }
}
