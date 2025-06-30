import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
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
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { AutofocusDirective } from '../../../../shared/directives/autofocus.directive';
import { ApiService } from '../../../../../services/api.service';
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
    AutofocusDirective,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [DatePipe], // Add DatePipe to providers here
})
export class FormComponent implements OnInit {
  public editFile: any;
  public url = global_const.imgUpload;
  public logo: any;
  public submitted: any;
  public Id: any;
  public disableParent = true;
  public group: any;
  public subGroup: any;

  public organizationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private query: ActivatedRoute,
    private route: Router,
    private toast: ToastrService,
    private datePipe: DatePipe, // Inject DatePipe here
    private reusable: ReusableAPIService
  ) {
    //Store Id from Params
    this.query.params.subscribe((data: any) => {
      this.Id = parseInt(data.id);
    });

    //Assigning field to the form
    this.organizationForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(global_const.startSpace)],
      ],
      address: [null],
      logoUrl: [null /*[Validators.required]*/],
      // isStorageInAisle:[null , [Validators.required]],
      // isStorageInRack: [null],
      contactNo: [
        null,
        [Validators.required, Validators.pattern(global_const.contactNoIndia)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(global_const.emailRegex)],
      ],
    });
  }

  ngOnInit(): void {
    if (this.Id) {
      this.getDatabyID();
    }
  }

  //Getting FormControl for validation
  get f(): any {
    return this.organizationForm.controls;
  }

  checkBoxChange(e: any) {
    e ? (this.disableParent = false) : (this.disableParent = true);
  }

  getDatabyID() {
    this.apiService
      .get(`/api/Organization/GetOrganizationById/${this.Id}`)
      .subscribe({
        next: (data: any) => {
          this.editFile = data.data.logoUrl;
          console.log(this.editFile)

          this.organizationForm.patchValue({
            ...data.data
          });
        },
      });
  }

  //  As per discussion with sir on 14 Aug 2024
  // checkAisle:boolean = false
  // getAisleValue(e:any){

  //   if(!e){
  //     this.checkAisle = true
  //   }else{
  //     this.checkAisle = false
  //   }
  // }

  // getRackValue(e:any){
  //   let b = localStorage.setItem('rack',e)
  // }

  // On File Selection
  onFileChanged(event: any) {
    if (
      event.target.files[0].name.includes('png') ||
      event.target.files[0].name.includes('jpg') ||
      event.target.files[0].name.includes('jpeg')
    ) {
      const inputFile = event.target.files[0];
      const img = new Image(); // Create a new Image object

      // Create an object URL for the file (no need to use FileReader)
      let url = URL.createObjectURL(inputFile);
      img.src = url;

      img.onload = () => {
        // Once the image is loaded, revoke the object URL to free up resources
        URL.revokeObjectURL(url);

        // Get the natural width and height of the image
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > 200 || height > 200) {
          console.log("sad");
          this.toast.error('Please select image with height and width less than or equal to 200px');
          return
        }
      };
    } else {
      event.target.value = '';
      // alert("Please Select Logo - .png, .jpg, .jpeg");
      this.toast.error('Please Select Logo - .png, .jpg, .jpeg');
      return;
    }
    if (event.target.files[0].size > 5 * 1024 * 1024) {
      event.target.value = '';
      this.toast.error('File size exceeds the limit of 5 MB');
      return;
    }

    if (event.target.files.length) {
      // this.editImgSrc = null;
      this.logo = event.target.files[0];
      this.onLogo()
    } else {
      this.toast.error('pls select file');
    }
  }

  // Image of Organization API Integration
  onLogo() {
    let formData = new FormData();
    formData.append('file', this.logo);

    this.apiService
      .post(`/api/Organization/LogoUpload`, formData, {
        organizationId: this.Id,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data.data.logoFileName)
          this.toast.success(data.message, "Image uploaded successfully!");
        },
        error: (err: any) => {
          this.toast.error(err.error.message);
        },
      });
  }

  //On Form Submit button click event
  onSubmit() {
    this.submitted = true;
    let a = localStorage.setItem(
      'organization',
      JSON.stringify(this.organizationForm.value)
    );

    //Return if Form invalid
    if (this.organizationForm.invalid) {
      return;
    }

    //For Edit if Id found
    if (this.Id) {
      this.organizationForm.value.id = this.Id;

      this.apiService
        .post(
          `/api/Organization/UpdateOrganization`,
          this.organizationForm.value
        )
        .subscribe({
          next: (data: any) => {
            localStorage.setItem('organization', JSON.stringify(data.data))
            this.reusable.organizationName.set(data.data.name)
            console.log(data.data.name)
            // if (this.logo) {
            // this.onLogo();
            // }

            this.toast.success(data.message);
            this.route.navigateByUrl('/admin/organization');
          },
        });
    }
    // else {
    //     this.apiService.post(`/api/Asset/InsertAsset`, this.organizationForm.value).subscribe({
    //       next: (data: any) => {
    //         this.toast.success(data.message)
    //         this.route.navigateByUrl('/admin/asset')
    //       },
    //       error: (err: any) => {
    //         console.log(err, "dsdsd");
    //       }
    //     })
  }
}
