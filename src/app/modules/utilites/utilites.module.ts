import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes =[
    {
      path: 'breakdown-maintenance',
      loadChildren: () => import('./breakdown-maintenance/breakdown-maintenance.module').then((m) => m.BreakdownMaintenanceModule),
    },
    {
      path: 'routine-maintenance',
      loadChildren: () => import('./routine-maintenance/routine-maintenance.module').then((m) => m.RoutineMaintenanceModule),
    },
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     RouterModule.forChild(routes)
  ]
})
export class UtilitesModule { }
