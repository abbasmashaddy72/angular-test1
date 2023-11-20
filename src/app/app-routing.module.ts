import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthenticationGuard } from './helpers/authentication.guard'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { HomeComponent } from './pages/home/home.component'
import { ProductsComponent } from './pages/products/products.component'
import { SignInComponent } from './pages/signIn/signIn.component'
import { StorageComponent } from './pages/storage/storage.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    data: { title: 'Sign In' }
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'admin/products',
    component: ProductsComponent,
    data: { title: 'Products' },
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'admin/storage',
    component: StorageComponent,
    data: { title: 'Storage' },
    canActivate: [AuthenticationGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
