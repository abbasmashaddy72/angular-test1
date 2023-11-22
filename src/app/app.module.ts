import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule
} from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { DataTablesModule } from 'angular-datatables'
import { NotifierModule } from 'angular-notifier'
import { TokenInterceptor } from './helpers/token.interceptor'

import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FolderListComponent } from './components/folder-list/folder-list.component'
import { FooterComponent } from './components/footer/footer.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { ModalProductComponent } from './edit/modal-product/modal-product.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { HomeComponent } from './pages/home/home.component'
import { ProductsComponent } from './pages/products/products.component'
import { SignInComponent } from './pages/signIn/signIn.component'
import { StorageComponent } from './pages/storage/storage.component'
import { TranslationService } from './services/translation.service'
import { SharedModule } from './shared/shared.module'

export function HttpLoaderFactory (http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ProductsComponent,
    ModalProductComponent,
    StorageComponent,
    FolderListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule,
    NotifierModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    TranslationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (translationService: TranslationService) {
    translationService.init()
  }
}
