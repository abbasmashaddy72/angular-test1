import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor (private translate: TranslateService) {}

  init (): void {
    this.translate.setDefaultLang('en')
    this.translate.use(this.translate.getBrowserLang() || 'en')
  }

  getTranslation (key: string): string {
    return this.translate.instant(key)
  }

  changeLanguage (lang: string): void {
    this.translate.use(lang)
  }
}
