import { Component } from '@angular/core';
import { CommonGridComponent } from "../../../../layout/common-grid/common-grid.component";
import { MaterialGridComponent } from '../../../../layout/material-grid/material-grid.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonGridComponent, MaterialGridComponent],
  templateUrl: './list.component.html',
  styleUrl: '../../admin.module.scss'
})
export class ListComponent{

  //Shweta added column 'Sr.No'
  headers = [
    { key: 'rowIndex', label: 'Sr No.', tdStyle:{'text-align':'right'} },
    { key: 'name', label: 'Name' }
  ]
}