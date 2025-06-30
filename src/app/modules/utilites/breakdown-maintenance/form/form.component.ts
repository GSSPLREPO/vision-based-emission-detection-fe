import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { global_const } from '../../../../../config/global-constants';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { OnlyNumberDirective } from '../../../../shared/directives/only-number.directive';
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AllowDotDirective } from '../../../../shared/directives/allow-dot.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { FocusInvalidInputDirective } from '../../../../shared/directives/focus-invalid-input.directive';
import { AboutUsComponent } from '../../../../components/about-us/about-us.component';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgSelectModule,
    OnlyNumberDirective,
    AlphabetOnlyDirective,
    AllowDotDirective,
    AutofocusDirective,
    FocusInvalidInputDirective,
    AboutUsComponent,
    RouterLink
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent  implements OnInit{
 
  public submitted = false;
  breakdownmaintenanceForm: FormGroup;
  Id: any;
  datetime!: string;
  todayDate: string;
  startTime: string;
  endTime: string;
  department: any;
  rectifiedBy: any;
  timeValidation: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: ToastrService,
    private route: Router,
    private query: ActivatedRoute
  ){
    let currrentDate = new Date().toLocaleString('sv').replace(' ','T');
    this.todayDate = currrentDate.toString().slice(0,8);
    this.startTime = currrentDate.slice(11,19);
    this.endTime = currrentDate.slice(11,19);
    //console.log(this.endTime)
     //Store Id from Params
     this.query.params.subscribe((data: any) => {
      //console.log(data)
      this.Id = parseInt(data.id);
    });

   this.breakdownmaintenanceForm = this.formBuilder.group({
    maintainanceDate:[`${this.todayDate}`, [Validators.required]],
    equipmentTagNo: [null,[Validators.required]],
    equipmentName: [null,[Validators.required]],
    startTime: [`${this.startTime}`,[Validators.required]],
    endTime: [`${this.endTime}`,[Validators.required]],
    partNo: [null,[Validators.required]],
    partName: [null,[Validators.required]],
    area: [null,[Validators.required]],
    departmentId: [null, [Validators.required]],
    rectifiedById: [null, [Validators.required]],
    section: [null,[Validators.required]],
    cause: [null,[Validators.required]],
    detailBreakDown: [null,[Validators.required]],
    actionTaken: [null,[Validators.required]],
    remark: [null],
    isBreakDown: [true],//By Default value 0 to indetify that this for the break down
    status: [false], //0 For the InProgress by default Value
   });

  }

  ngOnInit(): void {
    this.getDepartment();
    this.getAllEmployee();
    if (this.Id) {
       // console.log(this.Id)
        this.getmMaintainanceDatabyID();
      }
  
  }

  //Getting FormControl for validation
  get f(): any {
    return this.breakdownmaintenanceForm.controls;
  }

  // Get all Department Data
  getDepartment() {
    this.apiService.get(`/api/Department/GetAllDepartment`).subscribe({
      next: (data: any) => {
        this.department = data.data;
      },
    });
  }

  // Get all Employee Data
  getAllEmployee() {
    this.apiService.get(`/api/Employee/GetAllEmpolyee`).subscribe({
      next: (data: any) => {
        this.rectifiedBy = data.data;
      },
    });
  }

  getTimeValidation() {
    const startTime = this.breakdownmaintenanceForm.get('startTime')?.value;
    const endTime = this.breakdownmaintenanceForm.get('endTime')?.value;
    //let minDate = new Date('1890-12-11').getTime();
    if (endTime <= startTime) {
      this.timeValidation = true; //Reset validation if flag are not provided. 
    } else {
      this.timeValidation = false; //Reset validation if flag are not provided. 
    }

  }


  //Get Data by ID (On Edit Page only)
  getmMaintainanceDatabyID() {
    this.apiService
      .get(`/api/Maintainance/GetMaintainanceById/${this.Id}`)
      .subscribe({
        next: (data: any) => {
          this.breakdownmaintenanceForm.patchValue({
            ...data.data,
            maintainanceDate: data.data.maintainanceDate.slice(0,10)
          });
        },
      });
  }

  //On Form Submit button click event
  onSubmit() {
    this.submitted = true;
    //Return if Form invalid
    if (this.breakdownmaintenanceForm.invalid) {
      //console.log(this.milkAnalysisForm.invalid,'test');
      // this.scrollToFirstInvalidControl()
      return;
    }

    //For Edit if Id found
    if (this.Id) {
      this.breakdownmaintenanceForm.value.id = this.Id;
      this.apiService
        .put(`/api/Maintainance/UpdateMaintainance`, this.breakdownmaintenanceForm.value)
        .subscribe({
          next: (data: any) => {
            this.toast.success(data.message);
            this.route.navigateByUrl('/utilities/breakdown-maintenance');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
    //For Add  if Id not found
    else {

      this.apiService
        .post(`/api/Maintainance/InsertMaintainance`, this.breakdownmaintenanceForm.value)
        .subscribe({
          next: (data: any) => {
            //console.log(data,'test');
            this.toast.success(data.message);
            this.route.navigateByUrl('/utilities/breakdown-maintenance');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
  }
    fromDateCheck: boolean = false;
      toDateCheck: boolean = false;
      dateValidation: boolean = false;
    
      getDateValidation() {
        const formDate = this.breakdownmaintenanceForm.get('fromDate')?.value;
        const toDate = this.breakdownmaintenanceForm.get('toDate')?.value;
        let minDate = new Date('1890-12-11').getTime();
        //console.log(minDate);
        if (new Date(formDate).getTime() < minDate) {
          this.fromDateCheck = true;
        } else {
          this.fromDateCheck = false;
        }
        if (new Date(toDate).getDate() < minDate) {
          this.toDateCheck = true;
        } else {
          this.toDateCheck = false;
        }
        if (formDate && toDate) {
          const fromDates = new Date(formDate).getTime();
          const toDates = new Date(toDate).getTime();
          this.dateValidation = fromDates > toDates;
        } else {
          this.dateValidation = false; //Reset validation if dates are not provided. 
        }
    
    
      }
}
