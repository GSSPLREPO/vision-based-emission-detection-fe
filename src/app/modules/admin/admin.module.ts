import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleRightComponent } from './role-right/role-right.component';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'employees',
    loadChildren: () => import('./employee/employee.module').then((m) => m.EmployeeModule),
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'organizations',
    loadChildren: () => import('./organization/organization.module').then((m) => m.OrganizationModule),
  },
  {
    path: 'departments',
    loadChildren: () => import('./department/department.module').then((m) => m.DepartmentModule),
  },
  {
    path: 'role-rights',
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
