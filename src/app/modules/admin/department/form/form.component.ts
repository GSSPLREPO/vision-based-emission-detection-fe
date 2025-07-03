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
  styleUrl: './form.component.scss'
})
export class FormComponent {
  
  public departmentForm: FormGroup;
  public submitted: boolean = false
  Id: any

  constructor
  (
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: Router,
    private query: ActivatedRoute,
    private toast: ToastrService,
    private reusable: ReusableAPIService
  )
  {

    this.query.params.subscribe((data: any) => {
      this.Id = parseInt(data.id);
    });

    this.departmentForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      contactPerson: [null, [Validators.required]],
      contactNo: [null, [Validators.required, Validators.pattern(global_const.contactNoIndia)]],
      organizationId: [null],
      email: [null, [Validators.pattern(global_const.emailRegex)]],
      remarks: [null],
    })
  }
  
  get f(): any {
    return this.departmentForm.controls;
  }
  
  onSubmit()
  {
    const formData = this.departmentForm.getRawValue();
    this.submitted = true

    if (this.departmentForm.invalid)
    {}
  }
}