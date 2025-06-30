import { Component } from '@angular/core';
import { CommonGridComponent } from "../../../../layout/common-grid/common-grid.component";
import { MaterialGridComponent } from '../../../../layout/material-grid/material-grid.component';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonGridComponent, MaterialGridComponent],
  templateUrl: './list.component.html',
  styleUrls: ['../../admin.module.scss'],
})
export class ListComponent {

  header = [
    { label: 'Sr.No', key: 'rowIndex',  tdStyle:{'text-align':'right'}  },
    { label: 'Name', key: 'name' },
    { label: 'User Type', key: 'userType' },
    { label: 'Role', key: 'roleName' },
    { label: 'Username', key: 'userName'},
    { label: 'Email', key: 'email' },
    // { title: 'Phone No.', data: 'mobileNo' },
    // {
    //   title: 'Actions',
    //   data: [],
    //   render: function (data: any, type: any, row: any) {
    //     let a = localStorage.getItem('username_id')
    //     // Check if the key is false, for example, row.canEdit
    //     if (row.id == a) {
    //       return `
    //         <div class="d-flex justify-content-center">
    //           <button class="btn btn-edit"><i class="fas fa-pen"></i></button>
    //           <button class="btn btn-delete"><i class="fas fa-trash tamatar"></i></button>
    //         </div>
    //       `;
    //     }
    //     return ''; // Return an empty string if the condition is not met
    //   },
    //   // defaultContent: `
    //   // <div class="d-flex justify-content-center">
    //   //   <button class="btn  btn-edit"><i class="fas fa-pen"></i></button>
    //   //   <button class="btn  btn-delete"><i class="fas fa-trash tamatar"></i></button>
    //   // </div>
    //   // `,
    //   orderable: false
    // }
  ]

}
