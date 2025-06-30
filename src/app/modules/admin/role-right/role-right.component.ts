import { navbarData } from '../../../layout/sidenav/nav-data';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { global_const } from '../../../../config/global-constants';
import { ApiService } from '../../../../services/api.service';
import { decryptData } from '../../../../services/utils';


@Component({
  selector: 'app-role-right',
  standalone: true,
  imports: [CommonModule,NgSelectModule,ReactiveFormsModule],
  templateUrl: './role-right.component.html',
  styleUrl: './role-right.component.scss'
})
export class RoleRightComponent implements OnInit{
  roles: any = [
    // {id:1, name: "Admin"}
  ]
  // navbarData = navbarData;
  navbarData:any;
  rolePermissionsForm: FormGroup;
  allSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: Router,
    private query: ActivatedRoute,
    private toast: ToastrService
  ) {

    //Assigning field to the form
    this.rolePermissionsForm = this.fb.group({
      roleId: [null],
      permissions: this.fb.array([])
    });
    // this.navbarData = this.flattenNavbarData(this.navbarData);
    // this.initializePermissions();
  }

  // To flat obj of Parent ad child relatiom
  flattenNavbarData(data: any): any[] {
    let flatData: any[] = [];
    data.forEach((item: any) => {
      const { items, ...rest } = item;
      flatData.push(rest);
      if (items) {
        items.forEach((subItem: any) => {
          flatData.push({ ...subItem, parentLabel: item.label });
        });
      }
    });
    return flatData;
  }

  //Defining Form Array of Permission
  get permissions(): FormArray {
    return this.rolePermissionsForm.get('permissions') as FormArray;
  }

  // Initializing defaul values for formarray 
  initializePermissions() {
    this.navbarData.forEach((item:any) => {
      this.permissions.push(this.fb.group({
        id: item.id,
        view: new FormControl({ value: false, disabled: item.parentId !== null }),
        insert: new FormControl({ value: false, disabled: item.parentId !== null}),
        update: new FormControl({ value: false, disabled: item.parentId !== null}),
        delete: new FormControl({ value: false, disabled: item.parentId !== null}),
        // view: null,
      }));
    });
  }

  ngOnInit(): void {
    this.getAllScreens()
    this.getRole();
    this.setPermissions()
    
  }

  // Modifing the data from api according to parent and child
  arrangeItems(data: any[]) {
    let flatData: any[] = [];
  
    for (const d of data) {
      if (!d.parentId) {
        flatData.push(d);
        const children = data.filter((b: any) => b.parentId === d.id);
        flatData.push(...children);
      }
    }
    return flatData;
  }
  
  // Get all Screens 
  getAllScreens(){
    this.apiService.get(`/api/RoleRights/GetAllScreens`).subscribe({
      next: (data: any) => {
        this.navbarData = this.arrangeItems(data.data)
        this.initializePermissions();
      },
      error: (err:any)=>{
        console.log(err,"asd");
      }
    })
  }

  // Get all Roles 
  getRole() {
    this.apiService.get(`/api/Role/GetAllRoles`).subscribe({
      next: (data: any) => {
        this.roles = data.data;
      }
    });
  }

  // Function not in user Currently
  checkAll(event: any): void {
    this.allSelected = event.target.checked;

    this.permissions.enable();
    this.permissions.controls.forEach(control => {
      if (!control.get('view')?.disabled) {
        control.patchValue({ 
          view: this.allSelected,
          insert: this.allSelected,
          update: this.allSelected,
          delete: this.allSelected 
        });
      }
    });
    if (!this.allSelected) {
      this.permissions.controls.forEach(control => {
        const navbarItem = this.navbarData.find((item:any) => item.id === control.value.id);
        if (navbarItem?.parentId != null) {
          control.disable();
        }
      });
    }
  }

  // Handling disabling of childs according to parent menu 
  toggleChildPermissions(parentId: number, isSelected: boolean): void {
    this.permissions.controls.forEach(control => {
      if (this.navbarData.find((item:any) => item.id === control.value.id)?.parentId === parentId) {
        if (isSelected) {
          control.get('view')?.enable();
          // control.get('insert')?.enable();
          // control.get('update')?.enable();
          // control.get('delete')?.enable();
        } else {
          control.get('view')?.disable();
          control.get('insert')?.disable();
          control.get('update')?.disable();
          control.get('delete')?.disable();
          control.patchValue({ 
            view: false,
            insert: false,
            update: false,
            delete: false,
          });
        }
      }
    });
  }

  // Get Role Id value on change from HTML 
  getValue(e: any) {
    if (e) {
        this.apiService.get(`/api/RoleRights/GetRoleRightsByRoleId/${e}`).subscribe({
            next: (data) => {
                if (data.data) {
                    this.patchPermissions(data.data);
                } else {
                    this.patchPermissions([]); // Clear permissions if no data
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    } 
    else {
      this.patchPermissions([]);
    }
}

  //Getting FormControl for validation
  get f():any{
    return this.rolePermissionsForm.controls
  }

  //On Form Submit button click event
  onSubmit() {

    const selectedPermissions = this.permissions.value.filter((permission: any) => permission.view && !permission.disabled);
    // let d = localStorage.setItem('menu',JSON.stringify(selectedPermissions))
    // return

    // Manipulate the data to send in api accordingly
    for(let d of selectedPermissions){
      d.screenId = d.id
      d.roleId = this.f.roleId.value
      delete d.id
    }

    //Insert api Integrated
    this.apiService.post('/api/RoleRights/AddRightsForRole',selectedPermissions).subscribe({
      next: (data)=>{
        this.toast.success(data.response.message)
        this.rolePermissionsForm.patchValue({
          roleId: null
        })
        this.patchPermissions([]);
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  // Toggle Permission for handling enable and disable 
  onParentChange(parentId: number, event: boolean): void {
    this.toggleChildPermissions(parentId, event);
  }

  // Toggle Permission for handling enable and disable 
  onChildChange(childId: number, event: boolean): void {
    this.changeChildPermissions(childId, event);
  }

  changeChildPermissions(childId:number, event:boolean){
    const control = this.permissions.controls.find(ctrl => ctrl.get('id')?.value === childId);
    if(control){
      if(event){
        control.get('insert')?.enable();
        control.get('update')?.enable();
        control.get('delete')?.enable();
      }else{
          control.get('insert')?.disable();
          control.get('update')?.disable();
          control.get('delete')?.disable();
          control.patchValue({
            insert: false,
            update: false,
            delete: false,
          });
      }
      // control.patchValue({
      //   insert: event,
      //   update: event,
      //   delete: event,
      //   });
    }
  }

  //Patch Value according to permission in form
  patchPermissions(data: any[]) {
    // Clear existing values first
    this.permissions.controls.forEach(control => {
        control.patchValue({ view: false, insert: false, update: false, delete: false });
    });

    // Patch permissions based on the retrieved data
    data.forEach(item => {
        const control = this.permissions.controls.find(ctrl => ctrl.get('id')?.value === item.screenId);
        if (control) {
            control.patchValue({ 
                view: item.view,
                insert: item.insert,
                update: item.update,
                delete: item.delete,
            });

            // Toggle child permissions if it's a parent
            if (!this.navbarData.find((navItem:any) => navItem.id === item.screenId)?.parentId) {
                this.toggleChildPermissions(item.screenId, item.view);
            }
        }
    });
}

  // Not in use currently 
  patchPermissions2(data: any[]) {
    // First patch parents
    data.forEach(item => {
      this.changeChildPermissions(item.id,item.view)
      const control = this.permissions.controls.find(ctrl => ctrl.get('id')?.value === item.id);
      if (control) {
        control.patchValue({ 
          view: item.view,
          insert: item.insert,
          update: item.update,
          delete: item.delete,
        });
        if (this.navbarData.find((navItem:any) => navItem.id === item.id)?.parentId == null) {
          this.toggleChildPermissions(item.id, item.view);
        }
      }
    });

    // Then patch children based on the updated parent state
    data.forEach(item => {
      const control = this.permissions.controls.find(ctrl => ctrl.get('id')?.value === item.id);
      if (control && this.navbarData.find((navItem:any) => navItem.id === item.id)?.parentId != null) {
        control.patchValue({ view: item.view });
      }
    });
  }


  //Setting Page access permissions

  isInsert = false;
  isView = false; 
  private setPermissions(): void {
    const permissions = decryptData(localStorage.getItem(global_const.permission));
    // const a:any = localStorage.getItem(global_const.permission);
    // const permissions = JSON.parse(a);
    // const pageName = this.route.url.split('/').pop();
    const pageName = this.route.url.slice(1);


    for (const e of permissions) {
      // console.log(e.screenDetails.routeLink,this.route.url,"ASd");
      // if (e.screenDetails.routeLink.includes(pageName)) {

      if (e.screenDetails.routeLink == pageName) {
        this.isView = e.view;
        this.isInsert = e.insert;
      }
    }
  }
}
