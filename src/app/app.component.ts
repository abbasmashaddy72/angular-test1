import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { filter, map } from 'rxjs'
import { Constants } from './config/constants'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: any = ''
  textDir: string = 'ltr'

  constructor (
    private router: Router,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (event.lang == 'ar') {
        this.textDir = 'rtl'
      } else {
        this.textDir = 'ltr'
      }
    })
  }

  ngOnInit () {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root
          let routeTitle = ''
          while (route!.firstChild) {
            route = route.firstChild
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title']
          }
          return routeTitle
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`${title} - ${Constants.siteTitle}`)
          this.title = title
        }
      })
  }
}
