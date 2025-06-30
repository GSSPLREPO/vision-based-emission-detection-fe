import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from '../../services/api-service.service';
import { global_const } from '../../../config/global-constants';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { encryptData } from '../../../services/utils';
import { Title } from '@angular/platform-browser';
import { ReusableAPIService } from '../../../services/reusable-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fieldTextType: boolean = false;
  logindata: FormGroup;
  showLoader = false;
  submitted = false;
  year = new Date().getFullYear();

  public FnYears: any = [];
  constructor(
    private titleService: Title,
    private _fb: FormBuilder,
    private _router: Router,
    private toast: ToastrService,
    private apiService: ApiService,
    public reusable: ReusableAPIService
  ) {
    this.titleService.setTitle(`SÜD-CHEMIE`);
    this.logindata = this._fb.group({
      Username: [
        null,
        [Validators.required, Validators.pattern(global_const.startSpace)],
      ],
      Password: [
        null,
        [Validators.required, Validators.pattern(global_const.startSpace)],
      ],
    });
  }

  get f(): any {
    return this.logindata.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  goback() {
    this._router.navigate(['/forgot-password']);
  }

  onSubmit() {
    this.submitted = true;
    this.showLoader = true;
    if (this.logindata.invalid) {
      this.showLoader = false
      return;
    }

    this.apiService
      .post(`/api/Login/LoginAuthentication`, undefined, this.logindata.value)
      .subscribe({
        next: (data: any) => {
          this.showLoader = false;
          this.submitted = false;
          this.toast.success("Login Successful")
          try {
            const permissions = encryptData(data.data.permissions);
            localStorage.setItem(global_const.permission, permissions);
            localStorage.setItem(global_const.token, data.data.token);
            localStorage.setItem('userName', data.data.userName);
            this.reusable.userName.set(data.data.name)
          }
          catch (e) {
            console.log("Error Occured ", e);
          }
          finally
          {
            this._router.navigate(["/about"])
          }
        },
        error: (err: any) => {
          this.showLoader = false;
          this.toast.error(err.error.message);
        },
      });
  }
}
