import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false
  isMenuOpen = false
  year = new Date().getFullYear()

  constructor (
    private authenticationService: AuthenticationService,
    private translate: TranslateService
  ) {}

  changeLanguage (lang: string): void {
    this.translate.use(lang)
  }

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
