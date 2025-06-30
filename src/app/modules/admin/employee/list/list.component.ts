import { Component } from '@angular/core';
import { MaterialGridComponent } from "../../../../layout/material-grid/material-grid.component";


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MaterialGridComponent],
  templateUrl: './list.component.html',
  styleUrl: '../../admin.module.scss'
})
export class ListComponent {
  headers = [
    { key: 'rowIndex', label: 'Sr No.', tdStyle:{'text-align':'right'} },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {  key: 'isUser', 
      label: 'Has User', 
      render: (data: any) => data ? 'Yes' : 'No' }
  ]
}
