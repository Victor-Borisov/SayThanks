import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { ThankPageComponent } from './thank-page/thank-page.component';
import { WelldoersPageComponent } from './welldoers-page/welldoers-page.component';
import { WelldoersFormComponent } from './welldoers-page/welldoers-form/welldoers-form.component';
import { ThankWelldoersComponent } from './thank-page/thank-welldoers/thank-welldoers.component';
import { ThankGoodsComponent } from './thank-page/thank-goods/thank-goods.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'overview', component: OverviewPageComponent},
      {path: 'analytics', component: AnalyticsPageComponent},
      {path: 'history', component: HistoryPageComponent},
      {path: 'saythanks', component: ThankPageComponent, children: [
        {path: '', component: ThankWelldoersComponent},
        {path: ':id', component: ThankGoodsComponent}
    ]},
    {path: 'welldoers', component: WelldoersPageComponent},
      {path: 'welldoers/new', component: WelldoersFormComponent},
      {path: 'welldoers/:id', component: WelldoersFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
