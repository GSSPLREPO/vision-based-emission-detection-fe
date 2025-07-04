import { Component } from '@angular/core';
import { 
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit
} from '@angular/core';
import{
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
}from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CommonGridComponent } from '../../../layout/common-grid/common-grid.component';
import { ApiService } from '../../../../services/api.service';
import { global_const } from '../../../../config/global-constants';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment.development';
import { map, Subscription } from 'rxjs';
import { MaterialGridComponent } from '../../../layout/material-grid/material-grid.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-emission-report',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomCurrencyPipe,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgSelectModule,
    MaterialGridComponent
  ],
  templateUrl: './emission-report.component.html',
  styleUrl: './emission-report.component.scss',
  providers: [DatePipe, CustomCurrencyPipe]
})
export class EmissionReportComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource:any;
  userName: any;
  public currencyType = global_const.currencyType;
  public submitted = false;
  public showLoader = false;
  dateForm: FormGroup;
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
      let a = new Date().toLocaleString('sv').replace(' ', 'T');
      this.todayDate = a.slice(0, 10);
      this.dateForm = this.fb.group({
      from: [`${this.todayDate}T00:00:00`, [Validators.required]],
      to: [a, [Validators.required]],
      chimneyId: [null]
    });
  }

  get f(): any {
    return this.dateForm.controls;
  }
  
  fromDateCheck: boolean = false;
  toDateCheck: boolean = false;
  dateValidation: boolean = false;
  getDateValidation() {
   const fromDate = this.dateForm.get('from')?.value;
   const toDate = this.dateForm.get('to')?.value;
  
   let minDate = new Date('1890-12-11').getTime();
   if (new Date(fromDate).getTime() < minDate) {
     this.fromDateCheck = true;
   } else {
     this.fromDateCheck = false;
   }
   if (new Date(toDate).getTime() < minDate) {
     this.toDateCheck = true;
   } else {
     this.toDateCheck = false;
   }
   if (fromDate && toDate) {
     const transferDate = new Date(fromDate).getTime();
     const putToUseDate = new Date(toDate).getTime();
  
     this.dateValidation = transferDate > putToUseDate;
   } else {
     this.dateValidation = false; // Reset validation if dates are not provided
   }
 }

 updateTableData(data: any[]) {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
 }
 
 organization_name: any;
        organization_email: any;
        organization_phone: any;
        organization_address: any;
        ngOnInit(): void {
          this.getDepartment();
          // this.getTransitListAssetStockInOnLoad();
          //this.getSubGroup()
          let a = localStorage.getItem('organization');
          this.userName = localStorage.getItem('username') || "";
          if (a) {
            let organization = JSON.parse(a);
            this.organization_name = organization.name;
            this.organization_email = organization.emailId;
            this.organization_phone = organization.contactNo;
            this.organization_address = organization.address;
          }
        }
      
        attributesField(): FormGroup {
          return this.formBuilder.group({
            name: [null],
            value: [null],
          });
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
            const from = this.dateForm.get('from')?.value;
            const to = this.dateForm.get('to')?.value;
            const chimneyId = this.dateForm.get('chimneyId')?.value
            //console.log(from, to);
        
            if (this.dateForm.invalid) {
              return;
            }
            
            if (chimneyId)
            {
              this.apiURL = `/api/Report/GasEmissionReport?FromDateTime=${from}&ToDateTime=${to}&ChimneyId=${chimneyId}`;
            }
            else
              this.apiURL = `/api/Report/GasEmissionReport?FromDateTime=${from}&ToDateTime=${to}`;
            
            this.apiService.get(this.apiURL)
  .pipe(
    map((response: any) => {
      if (!response || !response.data || response.data.length === 0) {
        throw new Error('No Data Found');
      }

      return response.data.map((obj: any) => {
        console.log(obj)
        const color = this.parseColor(obj['gasEmissionColor']);
        const duration = obj['emissionEndDateTime']
          ? this.humanDiff(
              Date.parse(obj['emissionEndDateTime']),
              Date.parse(obj['emissionStartDateTime'])
            )
          : "";

        return {
          ...obj,
          color,
          duration,
        };
      });
    })
  )
  .subscribe({
    next: (data: any[]) => {
      this.showLoader = false;

      this.reportData = data;
      this.dataSource = new MatTableDataSource(data);
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    },
    error: (err: any) => {
      this.showLoader = false;
      console.error('API Error:', err);

      if (err.message === 'No Data Found') {
        this.toast.warning('No data found for the selected parameters.');
      } else {
        this.toast.error('Failed to fetch data. Please try again.');
      }
    },
  });

  }
  
  
}
