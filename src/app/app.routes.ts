import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '../services/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { noQueryGuard, queryGuard } from '../services/query-guard.guard';
import { permissionGuard } from '../services/permission.guard';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                // canActivate: [authGuard,noQueryGuard,permissionGuard ]
            },
            {
                path: 'about',
                component: AboutUsComponent,
                // canActivate: [authGuard,noQueryGuard, permissionGuard ]
            },
            {
                path: 'admin',
                loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
                // canActivate: [authGuard]
            },
            {
              path: 'operation',
              loadChildren: () => import('./modules/operations/operations.module').then((m) => m.OperationsModule)
            },
            {
                path: 'reports',
                loadChildren: () => import('./modules/reports/reports.module').then((m) => m.ReportsModule)
            }
        ]
    },
    {
        path: "**",
        component: PageNotFoundComponent
    },
];