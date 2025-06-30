import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OnlyNumberDirective } from '../../../../shared/directives/only-number.directive';
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AllowDotDirective } from '../../../../shared/directives/allow-dot.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { FocusInvalidInputDirective } from '../../../../shared/directives/focus-invalid-input.directive';
import { AboutUsComponent } from '../../../../components/about-us/about-us.component';
import { ApiService } from '../../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgSelectModule,
    OnlyNumberDirective,
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
   routinemaintenanceForm: FormGroup;
    Id: any;
    datetime!: string;
    todayDate: string;
    startTime: string;
    endTime: string;
    department: any;
    rectifiedBy: any;
    timeValidation: boolean = false;
    dueDate: string;
  nextDueDate: string;
  fromDateCheck: boolean = false;
  toDateCheck: boolean = false;
  dueDateValidation: boolean = false;
  nextDueDateValidation: boolean = false;

    constructor(
      private formBuilder: FormBuilder,
      private apiService: ApiService,
      private toast: ToastrService,
      private route: Router,
      private query: ActivatedRoute
    ){
      let currentTime = new Date().toLocaleString('sv').replace(' ','T');

      // Get the current date
      let currentDate = new Date();

      // Format today's date as 'YYYY-MM-DD'
      this.todayDate = currentDate.toISOString().slice(0, 10);

      // Calculate next date by adding 1 day
      let nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      this.dueDate = nextDate.toISOString().slice(0, 10);

      // Calculate next-to-next date by adding 2 days
      let nextToNextDate = new Date(currentDate);
      nextToNextDate.setDate(nextToNextDate.getDate() + 2);
      this.nextDueDate = nextToNextDate.toISOString().slice(0, 10);

      this.startTime = currentTime.slice(11,19);
      this.endTime = currentTime.slice(11,19);
      //console.log(this.endTime)
       //Store Id from Params
       this.query.params.subscribe((data: any) => {
        //console.log(data)
        this.Id = parseInt(data.id);
      });
  
     this.routinemaintenanceForm = this.formBuilder.group({
      maintainanceDate:[`${this.todayDate}`, [Validators.required]],
      dueDate:[`${this.dueDate}`, [Validators.required]],
      nextDueDate:[`${this.nextDueDate}`, [Validators.required]],
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
      actionTaken: [null,[Validators.required]],
      remark: [null],
      isBreakDown: [false],//By Default value 0 to indetify that this for the routine
      status: [false], //0 For the InProgress by default Value
     });
  
    }
  
    ngOnInit(): void {
      this.getDepartment();
      this.getAllEmployee();
      if (this.Id) {
          //console.log(this.Id)
          this.getmMaintainanceDatabyID();
        }
    
    }
    //Getting FormControl for validation
  get f(): any {
    return this.routinemaintenanceForm.controls;
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
    const startTime = this.routinemaintenanceForm.get('startTime')?.value;
    const endTime = this.routinemaintenanceForm.get('endTime')?.value;
    //let minDate = new Date('1890-12-11').getTime();
    if (endTime <= startTime) {
      this.timeValidation = true; //Reset validation if flag are not provided. 
    } else {
      this.timeValidation = false; //Reset validation if flag are not provided. 
    }

  }

  getDateValidation() {
    const maintainanceDate = this.routinemaintenanceForm.get('maintainanceDate')?.value;
    const dueDate = this.routinemaintenanceForm.get('dueDate')?.value;
    const nextDueDate = this.routinemaintenanceForm.get('nextDueDate')?.value;
    if (dueDate <= maintainanceDate) {
      this.dueDateValidation = true; //Reset validation if flag are not provided. 
    } else {
      this.dueDateValidation = false; //Reset validation if flag are not provided. 
    }
    if (nextDueDate<= dueDate) {
      this.nextDueDateValidation = true; //Reset validation if flag are not provided. 
    } else {
      this.nextDueDateValidation = false; //Reset validation if flag are not provided. 
    }


  }


  //Get Data by ID (On Edit Page only)
  getmMaintainanceDatabyID() {
    this.apiService
      .get(`/api/Maintainance/GetMaintainanceById/${this.Id}`)
      .subscribe({
        next: (data: any) => {
          this.routinemaintenanceForm.patchValue({
            ...data.data,
            maintainanceDate: data.data.maintainanceDate.slice(0,10),
            dueDate: data.data.dueDate.slice(0,10),
            nextDueDate: data.data.nextDueDate.slice(0,10),
          });
        },
      });
  }

  //On Form Submit button click event
  onSubmit() {
    this.submitted = true;
    //Return if Form invalid
    if (this.routinemaintenanceForm.invalid) {
      //console.log(this.milkAnalysisForm.invalid,'test');
      // this.scrollToFirstInvalidControl()
      return;
    }

    //For Edit if Id found
    if (this.Id) {
      this.routinemaintenanceForm.value.id = this.Id;
      this.apiService
        .put(`/api/Maintainance/UpdateMaintainance`, this.routinemaintenanceForm.value)
        .subscribe({
          next: (data: any) => {
            this.toast.success(data.message);
            this.route.navigateByUrl('/utilities/routine-maintenance');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
    //For Add  if Id not found
    else {

      this.apiService
        .post(`/api/Maintainance/InsertMaintainance`, this.routinemaintenanceForm.value)
        .subscribe({
          next: (data: any) => {
            //console.log(data,'test');
            this.toast.success(data.message);
            this.route.navigateByUrl('/utilities/routine-maintenance');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
  }


}
