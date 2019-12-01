import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './core-ui/containers';

import { P404Component } from './core-ui/views/error/404.component';
import { P500Component } from './core-ui/views/error/500.component';
import { SignInComponent } from './custom-ui/auth/sign-in/sign-in.component';
import { SignUpComponent } from './custom-ui/auth/sign-up/sign-up.component';
import { GenericPagesGuard } from './custom-ui/shared/services/generic-pages-guard.service';
import { AuthFormsPagesGuard } from './custom-ui/shared/services/auth-forms-pages-guard.service';
import { CreateWarehouseComponent } from './custom-ui/admin/warehouse-management/create-warehouse/create-warehouse.component';
import { AddProductsComponent } from './custom-ui/admin/warehouse-management/add-products/add-products.component';
import { DashboardComponent } from './custom-ui/admin/dashboard/dashboard.component';
import { SubordinateManagementComponent } from './custom-ui/admin/subordinate-management/subordinate-management.component';
import { SignUpSubordinatesComponent } from './custom-ui/admin/subordinate-management/sign-up-subordinates/sign-up-subordinates.component';
import { CreateTasksComponent } from './custom-ui/admin/warehouse-management/create-tasks/create-tasks.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '404',
        component: P404Component,
        data: {
          title: 'Page 404'
        }
      },
      {
        path: '500',
        component: P500Component,
        data: {
          title: 'Page 500'
        }
      },
      {
        path: 'sign-in',
        component: SignInComponent,
        data: {
          title: 'Sign In'
        },
        canActivate: [AuthFormsPagesGuard]
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        data: {
          title: 'Sign Up'
        },
        canActivate: [AuthFormsPagesGuard]
      },
      {
        path: 'create-warehouse',
        component: CreateWarehouseComponent,
        data: {
          title: 'Create Warehouse'
        },
        canActivate: [GenericPagesGuard]
      },
      {
        path: 'sign-up-subordinates',
        component: SignUpSubordinatesComponent,
        data: {
          title: 'Register Subordinates'
        },
        canActivate: [GenericPagesGuard]
      },
      {
        path: 'add-products',
        component: AddProductsComponent,
        data: {
          title: 'Add Products'
        },
        canActivate: [GenericPagesGuard]
      },
      {
        path: 'create-tasks',
        component: CreateTasksComponent,
        canActivate: [GenericPagesGuard],
        data: {
          title: 'Create Tasks'
        },
      },
      {
        path: 'management',
        component: SubordinateManagementComponent,
        canActivate: [GenericPagesGuard],
        data: {
          title: 'Management'
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'base',
        loadChildren: () => import('./core-ui/views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./core-ui/views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./core-ui/views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./core-ui/views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./core-ui/views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./core-ui/views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./core-ui/views/widgets/widgets.module').then(m => m.WidgetsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
