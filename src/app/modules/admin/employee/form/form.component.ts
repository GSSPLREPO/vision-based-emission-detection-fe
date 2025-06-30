import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { global_const } from '../../../../../config/global-constants';
import { ToastrService } from 'ngx-toastr';
import { OnlyNumberDirective } from '../../../../shared/directives/only-number.directive';
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AllowDotDirective } from '../../../../shared/directives/allow-dot.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { ApiService } from '../../../../../services/api.service';
import { FocusInvalidInputDirective } from '../../../../shared/directives/focus-invalid-input.directive';
import { ReusableAPIService } from '../../../../../services/reusable-api.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    RouterLink,
    OnlyNumberDirective,
    AlphabetOnlyDirective,
    AllowDotDirective,
    AutofocusDirective,
    FocusInvalidInputDirective,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  maxBirthDate: string;
  minDateLWD: string;
  getTimemaxBirthDate: number;
  Id: any;
  roles: any;
  department: any;
  organization: any;
  employeeForm: FormGroup;
  public submitted = false;
  public passwordType: 'text' | 'password' = 'password';
  public showPasswordMatch: boolean = false;
  addressTooLong = false;
  isUserChecked = false;
  isResignedChecked = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: Router,
    private query: ActivatedRoute,
    private toast: ToastrService,
    private reusable: ReusableAPIService
  ) 
  {
    //Birth Date Calculate
    let auxDate = this.substractYearsToDate(new Date(), 18);
    this.maxBirthDate = this.getDateFormateForSearch(auxDate);
    let a = new Date(this.maxBirthDate).getTime();
    this.getTimemaxBirthDate = a;

    this.minDateLWD = this.getDateFormateForSearch(new Date());

    //Store Id from Params
    this.query.params.subscribe((data: any) => {
      this.Id = parseInt(data.id);
    });

    //Assigning field to the form
    this.employeeForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(global_const.name)],
      ],
      employeeCode: [
        null,
        [Validators.required, Validators.pattern(global_const.auditName)],
      ],
      organisationId: [null],
      roleId: [null],
      departmentId: [null, [Validators.required]],
      address: [null],
      mobileNo: [
        null,
        [Validators.required, Validators.pattern(global_const.contactNoIndia)],
      ],
      email: [null, [Validators.pattern(global_const.emailRegex)]],
      isUser: [false],
      userName: [null,[Validators.pattern(global_const.username)]],
      password: [null],
      change_password: [false],
      confirm_password: [null],
      birthDate: [null,[Validators.required]],
      joinDate: [null],
      IsResigned: [false],
      resignationDate: [null],
      lastWorkingDate: [null],
    });
  }

  ngOnInit(): void {
    this.getDepartment();
    this.getOrganization();
    this.getRole();
    //Calling API on Edit Page
    if (this.Id) {
      this.getDatabyID();
      this.f.confirm_password.setValidators(null);
      this.f.password.setValidators(null);
      this.f.confirm_password.updateValueAndValidity();
      this.f.password.updateValueAndValidity();
    }
  }

  //Getting FormControl for validation
  get f(): any {
    return this.employeeForm.controls;
  }

  // Start of Birth Calculate Functions
  substractYearsToDate(auxDate: Date, years: number): Date {
    auxDate.setFullYear(auxDate.getFullYear() - years);
    return auxDate;
  }

  getDateFormateForSearch(date: Date): string {
    let year = date.toLocaleDateString('es', { year: 'numeric' });
    let month = date.toLocaleDateString('es', { month: '2-digit' });
    let day = date.toLocaleDateString('es', { day: '2-digit' });
    return `${year}-${month}-${day}`;
  }

  convertToDate(date: string) {
    let a = date.split('T');
    return a[0];
  }
  // End of Birth Calculate Functions

  //Get Data by ID (On Edit Page only)
  getDatabyID() {
    this.apiService
      .get(`/api/Employees/GetEmployeeById/${this.Id}`)
      .subscribe({
        next: (data: any) => {
          let birthDate = null;
          if (data.data.birthDate) {
            birthDate = this.convertToDate(data.data.birthDate);
          }
          let lastWorkingDate = null;
          if (data.data.lastWorkingDate) {
            lastWorkingDate = this.convertToDate(data.data.lastWorkingDate);
          }

          this.employeeForm.patchValue({
            ...data.data,
            birthDate: birthDate,
            lastWorkingDate: lastWorkingDate,
          });
        },
      });
  }

  dobCheck: boolean = false;
  checkDOB(data: any) {
    let a = new Date(data).getTime();
    let b = new Date('1890-12-11').getTime();
    if (a < b) {
      this.dobCheck = true;
    } else {
      this.dobCheck = false;
    }
  }

  lwdCheck: boolean = false;
  checkLWD(data: any) {
    let a = this.employeeForm.get('lastWorkingDate')?.value;
    let b = this.employeeForm.get('joinDate')?.value;
    let c = this.employeeForm.get('resignationDate')?.value;
    if (a < b || a < c) {
      this.lwdCheck = true;
    } else {
      this.lwdCheck = false;
    }
  }

  dorCheck: boolean = false;
  checkDOR(data: any) {
    let a = this.employeeForm.get('resignationDate')?.value;
    let b = this.employeeForm.get('joinDate')?.value;
    if (a < b) {
      this.dorCheck = true;
    } else {
      this.dorCheck = false;
    }
  }

  togglePassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
  }

  getChangeVal(e: any): void {
    if (!e) {
      this.f.confirm_password.setValidators(null);
      this.f.password.setValidators(null);
    } else {
      this.f.confirm_password.setValidators(Validators.required);
      this.f.password.setValidators([
        Validators.required,
        Validators.pattern(global_const.passwordRegex)

      ]);
    }
    this.f.confirm_password.updateValueAndValidity();
    this.f.password.updateValueAndValidity();
  }

  passwordMatch() {
    if (this.f.password.value !== this.f.confirm_password.value) {
      this.showPasswordMatch = true;
    } else {
      this.showPasswordMatch = false;
    }
}
    
  //On Form Submit button click event
  onSubmit() {
    const formData = this.employeeForm.getRawValue();
    this.submitted = true;
    //Return if Form invalid
    if (this.employeeForm.invalid || this.showPasswordMatch) {
      console.log(this.employeeForm.invalid,'test');
      // this.scrollToFirstInvalidControl()
      return;
    }

    if(!formData.password && !this.f.change_password.value){
      delete formData.password
    }

    delete formData.confirm_password

    //For Edit if Id found
    if (this.Id) {
      formData.id = this.Id;
      this.apiService
        .post(`/api/Employees/UpdateEmployee`, formData)
        .subscribe({
          next: (data: any) => {
            // signal()
            // this.reusable.userName.set(data.data.name)
            // localStorage.setItem('username', data.data.name);
            this.toast.success(data.message);
            this.route.navigateByUrl('/admin/employee');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
    //For Add  if Id not found
    else {
      this.apiService
        .post(`/api/Employees/AddEmployee`, formData)
        .subscribe({
          next: (data: any) => {
            this.toast.success(data.message);
            this.route.navigateByUrl('/admin/employee');
          },
          error: (err: any) => {
            this.toast.error(err.error.message);
          },
        });
    }
  }

  // Get all Department Data
  getDepartment() {
    this.apiService.get(`/api/Department/GetAllDepartments`).subscribe({
      next: (data: any) => {
        this.department = data.data;
      },
    });
  }

  // Get all GetAllOrganization Data
  getOrganization() {
    this.apiService.get(`/api/Organization/GetAllOrganizations`).subscribe({
      next: (data: any) => {
        this.organization = data.data.organization;
      },
    });
  }

   // Get all Role Data
   getRole() {
    this.apiService.get(`/api/Role/GetAllRoles`).subscribe({
      next: (data: any) => {
        this.roles = data.data;
      },
    });
  }

  toggleUserFields() {
    this.isUserChecked = this.employeeForm.get('isUser')?.value;

    if (this.isUserChecked) {
      this.employeeForm.get('userName')?.setValidators(Validators.required);
      this.employeeForm.get('password')?.setValidators(Validators.required);
    } else {
      this.employeeForm.get('userName')?.clearValidators();
      this.employeeForm.get('password')?.clearValidators();
    }
    this.employeeForm.get('userName')?.updateValueAndValidity();
    this.employeeForm.get('password')?.updateValueAndValidity();
  }

  toggleResignedFields() {
    this.isResignedChecked = this.employeeForm.get('IsResigned')?.value;

    if (this.isResignedChecked) {
      this.employeeForm.get('resignationDate')?.setValidators(Validators.required);
      this.employeeForm.get('lastWorkingDate')?.setValidators(Validators.required);
    } else {
      this.employeeForm.get('resignationDate')?.clearValidators();
      this.employeeForm.get('lastWorkingDate')?.clearValidators();

    }
    this.employeeForm.get('resignationDate')?.updateValueAndValidity();
    this.employeeForm.get('lastWorkingDate')?.updateValueAndValidity();
  }

  // Handle paste event to check if the pasted content exceeds 140 characters
  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    const currentValue = this.employeeForm.get('address')?.value || '';

    // Check if pasted content + existing content exceeds the limit
    if (currentValue.length + pastedText.length > 140) {
      event.preventDefault(); // Prevent paste
      this.addressTooLong = true; // Set flag to show error message
    } else {
      this.addressTooLong = false; // Reset flag if valid
    }
  }
}
