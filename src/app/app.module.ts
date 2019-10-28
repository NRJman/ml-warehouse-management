import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AuthModule } from './custom-ui/auth/auth.module';

import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './core-ui/containers';
import { P404Component } from './core-ui/views/error/404.component';
import { P500Component } from './core-ui/views/error/500.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './store/app.reducers';
import { CustomValidatorsService } from './custom-ui/shared/services/custom-validators.service';
import { AuthEffects } from './custom-ui/auth/store/auth.effects';
import { USERS_API_SERVER_URL_TOKEN, USERS_API_SERVER_URL } from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './custom-ui/shared/interceptors/auth.interceptor';
import { AuthGuard } from './custom-ui/shared/services/auth-guard.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 15
    }),
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: USERS_API_SERVER_URL_TOKEN,
      useValue: USERS_API_SERVER_URL
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    CustomValidatorsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
