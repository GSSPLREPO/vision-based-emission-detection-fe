import { Component } from '@angular/core';
import { MaterialGridComponent } from '../../../../layout/material-grid/material-grid.component';
import { CommonGridComponent } from '../../../../layout/common-grid/common-grid.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonGridComponent,
    MaterialGridComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  headers = [
    { key: 'rowIndex', label: 'Sr.No', tdStyle:{'text-align':'right'}},
    { key: 'maintainanceDate', label: 'Maintenance Date' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'equipmentTagNo', label: 'Equipment Tag No' },
    { key: 'equipmentName', label: 'Equipment Name' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'nextDueDate', label: 'Next Due Date' },
    { key: 'actionTaken', label: 'Action Taken' },
    { key: 'rectifiedBy', label: 'Rectified By' },
    { key: 'remark', label: 'Remark' },
    { key: 'userName', label: 'User Name' },
    { key: 'status', label: 'Status' },  
  ]

}
