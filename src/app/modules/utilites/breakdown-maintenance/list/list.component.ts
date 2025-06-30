import { Component } from '@angular/core';
import { CommonGridComponent } from '../../../../layout/common-grid/common-grid.component';
import { MaterialGridComponent } from '../../../../layout/material-grid/material-grid.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonGridComponent, MaterialGridComponent],
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
    { key: 'partNo', label: 'Part No' },
    { key: 'partName', label: 'Part Name' },
    { key: 'actionTaken', label: 'Action Taken' },
    { key: 'rectifiedBy', label: 'Rectified By' },
    { key: 'remark', label: 'Remark' },
    { key: 'userName', label: 'User Name' },
    { key: 'status', label: 'Status' },  
  ]

}
