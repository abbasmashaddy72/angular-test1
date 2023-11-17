import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { TranslationService } from '../services/translation.service'

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule],
  providers: [TranslationService]
})
export class SharedModule {}
