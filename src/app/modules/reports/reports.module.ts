import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { EmissionReportComponent } from './emission-report/emission-report.component';

const routes: Routes = [
  {
    path: '',
    component: EmissionReportComponent
  },
  {
    path: 'emission-report',
    component: EmissionReportComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportsModule { }
