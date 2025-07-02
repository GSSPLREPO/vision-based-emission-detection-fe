import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { ApiService } from '../../../../../services/api.service';
import { FocusInvalidInputDirective } from '../../../../shared/directives/focus-invalid-input.directive';
import { global_const } from '../../../../../config/global-constants';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, RouterLink, AlphabetOnlyDirective,AutofocusDirective,FocusInvalidInputDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  Id: any = 4
  cars = [
    { id: 1, name: 'Internal' },
    { id: 2, name: 'External' },
  ];
  roleForm: FormGroup
  public submitted = false;
  public passwordType: 'text' | 'password' = 'password';
  public showPasswordMatch: boolean = false;
  dropDownData:any
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: Router,
    private query: ActivatedRoute,
    private toast: ToastrService,

  ) {

    //Store Id from Params
    this.query.params.subscribe((data: any) => {
      this.Id = parseInt(data.id)
    })

    //Assigning field to the form
    this.roleForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(global_const.name)] ],
      description: [null],
      isDeleted: true
    })

  }

  ngOnInit(): void {
    //Calling API on Edit Page
    if (this.Id) {
      this.getDatabyID()
    }

  }

  //Getting FormControl for validation
  get f(): any {
    return this.roleForm.controls;
  }

  //Get Data by ID (On Edit Page only)
  getDatabyID() {
    this.apiService.get(`/api/Role/GetRoleById/${this.Id}`).subscribe({
      next: (data: any) => {
        this.roleForm.patchValue({
          ...data.data
        })
      }
    })
  }

  //On Form Submit button click event
  onSubmit() {
    this.submitted = true;
    //Return if Form invalid
    console.log(this.roleForm.invalid, "invalid");
    if (this.roleForm.invalid) {
      return
    }
    //For Edit if Id found
    if (this.Id) {
      this.roleForm.value.id = this.Id
      this.apiService.put(`/api/Role/UpdateRole`, this.roleForm.value).subscribe({
        next: (data: any) => {
          this.toast.success(data.message)
          this.route.navigateByUrl('/admin/roles')
        },error: (err:any) => {
          this.toast.error(err.error.message)
        }
      })
    }
     //For Add  if Id not found
    else {
      this.apiService.post(`/api/Role/AddRole`, this.roleForm.value).subscribe({
        next: (data: any) => {
          this.toast.success(data.message)
          this.route.navigateByUrl('/admin/roles')
        },
        error: (err: any) => {
          this.toast.error(err.error.message)
        }
      })
    }
  }


}
