import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { global_const } from '../../../../../config/global-constants';
import { ToastrService } from 'ngx-toastr';
import { OnlyNumberDirective } from '../../../../shared/directives/only-number.directive';
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AllowDotDirective } from '../../../../shared/directives/allow-dot.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../../../services/api.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, RouterLink,OnlyNumberDirective,AlphabetOnlyDirective,AllowDotDirective,AutofocusDirective,SafePipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  unsafeContent: string = '';

  Id: any
  roles: any;
  userType = [
    { id: 1, name: 'Internal' },
    { id: 2, name: 'External' },
  ];
  employee:any
  userForm: FormGroup
  public submitted = false;
  public passwordType: 'text' | 'password' = 'password';
  public showPasswordMatch: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: Router,
    private query: ActivatedRoute,
    private toast: ToastrService,
    private sanitizer: DomSanitizer
  ) {

    //Store Id from Params
    this.query.params.subscribe((data: any) => {
      this.Id = parseInt(data.id)
    })

    console.log(this.route.url);
    

    // let a = localStorage.getItem('username_id')
    // console.log(a)
    // if(this.route.url.includes('form')){   
    //   if(this.Id && a != this.Id){
    //     this.route.navigate(['/admin/user'])
    //   }
    // }

    //Assigning field to the form
    this.userForm = this.formBuilder.group({
      isActive: [null],
      name: [null],
      employeeName: [null],
      employeeCode: [null],
      employeeId:[null],
      userType: [null, [Validators.required]],
      roleId: [null, [Validators.required]],
      email: [null, [ Validators.pattern(global_const.emailRegex)]],
      userName: [null, [Validators.required, Validators.pattern(global_const.userRegex)]],
      password: ['', [Validators.required, Validators.pattern(global_const.passwordRegex)]],
      confirm_password: [null, [Validators.required]],
      change_password: [false],
      isDeleted : true,
      mobileNo: [null, [Validators.required,Validators.pattern(global_const.contactNoIndia)]],
    })

    this.f.employeeCode.disable()
    this.f.mobileNo.disable()

  }
  ngOnInit(): void {
    this.getAllEmployees()
    this.getRole()
    //Calling API on Edit Page
    if (this.Id) {
      this.getDatabyID()
      //Update Validation field on edit
      this.f.confirm_password.setValidators(null);
      this.f.password.setValidators(null);
      this.f.confirm_password.updateValueAndValidity();
      this.f.password.updateValueAndValidity();
    }

  }

  //Getting FormControl for validation
  get f(): any {
    return this.userForm.controls;
  }

  //Get Data by ID (On Edit Page only)
  getDatabyID() {    
    this.apiService.get(`/api/Users/GetUserById/${this.Id}`).subscribe({
      next: (data: any) => {
        console.log(data.users)
        this.userForm.patchValue({
          ...data.users,
          password : null
        })
      }
    })
  }
  // Get all employees 
  getAllEmployees(){
    this.apiService.get(`/api/Employees/GetAllEmployees?flag=true`).subscribe({
      next: (data: any) => {
       this.employee = data.data
      }
    })
  }

  // set field according to usertype 
  getUserType(e:any){
    this.f.name.clearValidators();
    this.f.mobileNo.clearValidators();
    this.f.employeeCode.clearValidators();
    this.f.employeeName.clearValidators();
    if(e){    
      if (e.name == 'Internal') {
        this.f.name.updateValueAndValidity();
        
        this.f.employeeCode.setValidators([Validators.required]);
        this.f.employeeCode.updateValueAndValidity();
        
        this.f.employeeName.setValidators([Validators.required]);
        this.f.employeeName.updateValueAndValidity();
        // this.f.email.enable()
    }
    
    if (e.name == 'External') {
        this.f.mobileNo.enable();

        this.f.mobileNo.setValidators([
          Validators.required,Validators.pattern(global_const.contactNoIndia)
      ]);
        this.f.name.setValidators([
            Validators.required,
            Validators.pattern(global_const.startSpace),
            Validators.pattern(global_const.noNumberAllowed)
        ]);
        
        this.f.name.updateValueAndValidity();
        this.f.mobileNo.updateValueAndValidity();
    }
    
    }
    else{
      this.userForm.patchValue({
        employeeCode: null,
        mobileNo: null,
        email: null
      })
      this.f.mobileNo.enable()
    }
  }
  
  
  // Patch value of employee on selection
  getEmployee(e:any){
    if(e){
      this.userForm.patchValue({
        employeeCode: e.employeeCode,
        mobileNo: e.mobileNo,
        email: e.email, 
        employeeName:e.name
             
      })
      this.f.mobileNo.disable()
      // this.f.email.disable()
    }else{
      this.userForm.patchValue({
        employeeCode: null,
        mobileNo: null,
        email: null
      })
      this.f.mobileNo.enable()
      // this.f.email.enable()
    }
    
  }

  // password toggle of eye
  togglePassword() {
    this.passwordType = this.passwordType == 'text' ? 'password' : 'text';
  }

  // check if confirm password match or not 
  passwordMatch() {
    if (this.f.password.value !== this.f.confirm_password.value) {
      this.showPasswordMatch = true;
    } else {
      this.showPasswordMatch = false;
    }
}

  
   //On Form Submit button click event
  onSubmit() {
    const formData = this.userForm.getRawValue();
    
    // To Sanitize email field from attacts
    const sanitizedEmail = this.sanitizer.sanitize(1, formData.email);

    formData.email = sanitizedEmail   
    this.submitted = true;

    console.log(this.userForm.invalid,"as");
    
    //Return if Form invalid
    if (this.userForm.invalid || this.showPasswordMatch) {    
      return;
    } 
 
    if(!formData.password && !this.f.change_password.value){
      delete formData.password
    }

    delete formData.confirm_password
    delete formData.employeeName
    console.log(formData)
    //For Edit if Id found
    if (this.Id) {
      formData.id = this.Id
      this.apiService.put(`/api/Users/UpdateUser`, formData).subscribe({
        next: (data: any) => {
          this.toast.success(data.message)
          this.route.navigateByUrl('/admin/user')
        },
        error: (err: any) => {
          this.toast.error(err.error.message)
        }
      })
    }
    //For Add  if Id not found 
    else {
      this.apiService.post(`/api/Users/AddUser`, formData).subscribe({
        next: (data: any) => {
          this.toast.success(data.message)
          this.route.navigateByUrl('/admin/user')
        },
        error: (err: any) => {
          this.toast.error(err.error.message)
        }
      })
    }
  }


  // Update validation of password on change of checkbox 
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

  // Get all roles 
  getRole() {
    this.apiService.get(`/api/Role/GetAllRoles`).subscribe({
      next: (data: any) => {
        this.roles = data.data
      }
    })
  }
}
