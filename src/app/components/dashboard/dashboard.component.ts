import { CommonModule, DatePipe } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { global_const } from '../../../config/global-constants';
import { ApiService } from '../../../services/api.service';
import { ReusableAPIService } from '../../../services/reusable-api.service';
import { CustomCurrencyPipe } from '../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, CustomCurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe,CustomCurrencyPipe]
})
export class DashboardComponent implements OnInit{
  ngOnInit(): void {
  }
}