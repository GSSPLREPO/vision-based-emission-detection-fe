import { Component } from '@angular/core';
import { CommonGridComponent } from "../../../../layout/common-grid/common-grid.component";
import { GridComponent } from "../../../../layout/grid/grid.component";
import { MaterialGridComponent } from "../../../../layout/material-grid/material-grid.component";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonGridComponent, GridComponent, MaterialGridComponent],
  templateUrl: './list.component.html',
  styleUrl: '../../admin.module.scss'
})
export class ListComponent {

  // header = [
  //   { id: 'id', name: 'ID', width: '80px',  sort: true },
  //   { id: 'name', name: 'Name', sort: true, filter: { enabled: true } },
  
  // ]
  //Shweta updates column name from 'No.' to 'Sr.No'
  headers = [
    // { key: 'id', label: 'Sr.No' ,
    //   style : {
    //     width: '10%',
    //   }
    //  },
     { key: 'rowIndex', label: 'Sr No.',  tdStyle:{'text-align':'right'} },
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  ]
  
}
