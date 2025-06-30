import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { RouterModule, Routes } from '@angular/router';
import { permissionGuard } from '../../../../services/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    // canActivate: [permissionGuard ]
  },
  {
    path: 'form',
    component: FormComponent,
    // canActivate: [permissionGuard ]
  },
  {
    path: 'form/:id',
    component: FormComponent,
    // canActivate: [permissionGuard ]
  },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RolesModule { }
