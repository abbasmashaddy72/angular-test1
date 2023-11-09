import { Component } from '@angular/core'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor (private authenticationService: AuthenticationService) {}

  isMenuOpen = false

  toggleMenu () {
    this.isMenuOpen = !this.isMenuOpen
  }

  isLoggedIn = this.authenticationService.isLoggedIn()

  logout (): void {
    this.authenticationService.logout()
  }
}
