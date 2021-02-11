import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { ThankPageComponent } from './thank-page/thank-page.component';
import { WelldoersPageComponent } from './welldoers-page/welldoers-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { WelldoersFormComponent } from './welldoers-page/welldoers-form/welldoers-form.component';
import { GoodsFormComponent } from './welldoers-page/welldoers-form/goods-form/goods-form.component';
import { ThankGoodsComponent } from './thank-page/thank-goods/thank-goods.component';
import { ThankWelldoersComponent } from './thank-page/thank-welldoers/thank-welldoers.component';
import { HistoryListComponent } from './history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './history-page/history-filter/history-filter.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    ThankPageComponent,
    WelldoersPageComponent,
    LoaderComponent,
    WelldoersFormComponent,
    GoodsFormComponent,
    ThankGoodsComponent,
    ThankWelldoersComponent,
    HistoryListComponent,
    HistoryFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
