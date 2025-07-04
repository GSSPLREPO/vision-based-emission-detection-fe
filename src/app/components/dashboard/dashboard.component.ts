import { CommonModule, DatePipe } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { global_const } from '../../../config/global-constants';
import { ApiService } from '../../../services/api.service';
import { MaterialGridComponent } from '../../layout/material-grid/material-grid.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReusableAPIService } from '../../../services/reusable-api.service';
import { CustomCurrencyPipe } from '../../shared/pipes/custom-currency.pipe';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe,CustomCurrencyPipe]
})
export class DashboardComponent{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource:any;
  userName: any;
  public currencyType = global_const.currencyType;
  public submitted = false;
  public showLoader = false;
  Id: any;
  department: any;
  apiURL: any = null;
  dateValueRefine: any = new Date().toISOString().split('T')[0]; // This will give 'YYYY-MM-DD'
  todayDate: any;
  
  humanDiff (t1: any, t2: any) {
    const diff = Math.max(t1,t2) - Math.min(t1,t2) 
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    
    const hrs = Math.floor(diff/HRS).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const min = Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const sec = Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const ms = Math.floor(diff % SEC).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping: false})
    // const retHr = hrs != 0 ? `${hrs}hrs ` : ``
    // const retMin = min != "00" ? `${min}min ` : ``
    // const retSec = sec != "00" ? `${sec}sec ` : ``
    // const retMm = ms != "00" ? `${ms}ms` : ``
    
    // return `${hrs} hrs ${min} mins & ${sec} secs`
    // return `${retHr}${retMin}${retSec}${retMm}`
    return `${hrs}:${min}:${sec}`
  }
  
  constructor(
   private formBuilder: FormBuilder,
   private apiService: ApiService,
   private toast: ToastrService,
   private route: Router,
   private datePipe: DatePipe,
   public currencyPipe: CustomCurrencyPipe,
   private fb: FormBuilder
  ) {
            this.apiURL = `/api/Report/GasEmissionReport?FromDateTime=2014-01-01&ToDateTime=2030-01-01`;
            this.apiService.get(this.apiURL)
            .pipe(
              map(
                (d) => d.data.map((obj: any) => {
                    let status = ""
                    let color = this.parseColor(obj['gasEmissionColor'])
                    let duration = ""
                    duration = obj['emissionEndDateTime'] ? this.humanDiff(Date.parse(obj['emissionEndDateTime']), Date.parse(obj['emissionStartDateTime'])) : ""
                    return {
                      ...obj,
                      duration,
                      color
                    }
                  })
              )
            )
            .subscribe({
              next: (data: any) => {
                this.showLoader = false;
                if (data != null)
                {
                  console.log(data)
                  this.reportData = data;
                  this.dataSource = new MatTableDataSource(data);
                  if (this.dataSource) {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                  }
                }
                else {
                  this.toast.warning('No Data Found');
                }
                
                // this.totalValue = data.data.totalValue;
              },
              error: (err: any) => {
                this.showLoader = false;
                console.log(err);
              },
            });
  }
 updateTableData(data: any[]) {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
 }
        // Get all Department Data
        getDepartment() {
          this.apiService.get(`/api/Department/GetAllDepartments`).subscribe({
            next: (data: any) => {
              this.department = data.data;
            },
          });
        }
  
      reportData: any;
      
      public doFilter = (e: any) => {
        this.dataSource.filter = e.target.value.trim().toLocaleLowerCase();
      };
      
      parseColor(col: string)
      {
        if (col === "yellow" || col === "Yellow")
          return `<span style='color: red'>${col}</span>`
        else
          return `${col}`
      }
          
      onGenerate() {
            this.showLoader = true
            // const from = this.dateForm.get('from')?.value;
            // const to = this.dateForm.get('to')?.value;
            //console.log(from, to);
        
            // if (this.dateForm.invalid) {
            //   return;
            // }
            this.apiURL = `/api/Report/GasEmissionReport?FromDateTime=2014-01-01&ToDateTime=2030-01-01`;
            this.apiService.get(this.apiURL)
            .pipe(
              map(
                (d) => d.data.map((obj: any) => {
                    let status = ""
                    let color = this.parseColor(obj['gasEmissionColor'])
                    let duration = ""
                    duration = obj['emissionEndDateTime'] ? this.humanDiff(Date.parse(obj['emissionEndDateTime']), Date.parse(obj['emissionStartDateTime'])) : ""
                    return {
                      ...obj,
                      duration,
                      color
                    }
                  })
              )
            )
            .subscribe({
              next: (data: any) => {
                this.showLoader = false;
                if (data != null)
                {
                  console.log(data)
                  this.reportData = data;
                  this.dataSource = new MatTableDataSource(data);
                  if (this.dataSource) {
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                  }
                }
                else {
                  this.toast.warning('No Data Found');
                }
                
                // this.totalValue = data.data.totalValue;
              },
              error: (err: any) => {
                this.showLoader = false;
                console.log(err);
              },
            });
          }
}