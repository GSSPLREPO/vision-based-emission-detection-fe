import { Component } from '@angular/core';
import { MaterialGridComponent } from "../../../../layout/material-grid/material-grid.component";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MaterialGridComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  headers = [
    {key: 'rowIndex', label: 'Sr. No.', tdStyle: {'text-align': 'right'}},
    {key: 'name', label: 'Name'},
  ]
}
