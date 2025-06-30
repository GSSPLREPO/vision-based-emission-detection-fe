import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeModelComponent } from './change-model/change-model.component';
import { ViewLiveFeedComponent } from './view-live-feed/view-live-feed.component';
import { ViewDetectionComponent } from './view-detection/view-detection.component';
import { CalibrationComponent } from './calibration/calibration.component';
import { CalibrationStep2Component } from './calibration-step-2/calibration-step-2.component';

const routes: Routes = [
  {
    path: 'change-model',
    component: ChangeModelComponent
  },
  {
    path: 'live-feed',
    component: ViewLiveFeedComponent
  },
  {
    path: 'annotated',
    component: ViewDetectionComponent
  },
  {
    path: 'calibration',
    component: CalibrationComponent
  },
  {
    path: 'calibration-step2',
    component: CalibrationStep2Component
  },
  {
    path: "",
    component: ViewLiveFeedComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OperationsModule { }
