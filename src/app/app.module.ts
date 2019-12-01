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
import {
  USERS_API_SERVER_URL_TOKEN,
  USERS_API_SERVER_URL,
  ADMINS_API_SERVER_URL_TOKEN,
  ADMINS_API_SERVER_URL,
  WAREHOUSES_API_SERVER_URL_TOKEN,
  WAREHOUSES_API_SERVER_URL
} from './app.config';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './custom-ui/shared/interceptors/auth.interceptor';
import { GenericPagesGuard } from './custom-ui/shared/services/generic-pages-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { AdminEffects } from './custom-ui/admin/store/admin.effects';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedEffects } from './custom-ui/shared/store/shared.effects';
import { AuthFormsPagesGuard } from './custom-ui/shared/services/auth-forms-pages-guard.service';
import { WarehouseEffects } from './custom-ui/warehouse/store/warehouse.effects';
import { AdminModule } from './custom-ui/admin/admin.module';
import { AdminRightsInterceptor } from './custom-ui/shared/interceptors/admin-rights.interceptor';
import { SubordinateModule } from './custom-ui/subordinate/subordinate.module';
import { ProductActionsModalComponent } from './custom-ui/subordinate/warehouse-management/product-actions-modal/product-actions-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SubordinateEffects } from './custom-ui/subordinate/store/subordinate.effects';
import { ProductCategoryPredictionService } from './custom-ui/shared/services/product-category-prediction.service';

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
    AdminModule,
    SubordinateModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      AuthEffects,
      AdminEffects,
      SharedEffects,
      WarehouseEffects,
      SubordinateEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 15
    }),
    HttpClientModule,
    NgxSpinnerModule,
    ModalModule.forRoot()
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
      provide: ADMINS_API_SERVER_URL_TOKEN,
      useValue: ADMINS_API_SERVER_URL
    },
    {
      provide: WAREHOUSES_API_SERVER_URL_TOKEN,
      useValue: WAREHOUSES_API_SERVER_URL
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminRightsInterceptor,
      multi: true
    },
    GenericPagesGuard,
    AuthFormsPagesGuard,
    CustomValidatorsService,
    CookieService,
    ProductCategoryPredictionService
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ ProductActionsModalComponent ]
})
export class AppModule { }
