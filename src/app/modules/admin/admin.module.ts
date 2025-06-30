import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleRightComponent } from './role-right/role-right.component';

const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  {
    path: 'role',
    loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'organization',
    loadChildren: () => import('./organization/organization.module').then((m) => m.OrganizationModule),
  },
  {
    path: 'role-right',
    component: RoleRightComponent,
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
