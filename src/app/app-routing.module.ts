import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/signIn/signIn.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthenticationGuard } from './helpers/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    data: { title: 'Sign In' },
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    data: { title: 'Sign Up' },
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
