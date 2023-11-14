import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false
  isMenuOpen = false

  constructor (private authenticationService: AuthenticationService) {}

  toggleMenu () {
    this.isMenuOpen = !this.isMenuOpen
  }

  ngOnInit () {
    this.authenticationService.isAuthenticated$().subscribe(status => {
      this.isLoggedIn = status
    })
  }

  logout (): void {
    this.authenticationService.logout()
  }
}
