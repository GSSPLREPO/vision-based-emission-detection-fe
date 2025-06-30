import {
  AfterViewInit,
  Component,
  inject,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { decryptData } from '../../../services/utils';
import { global_const } from '../../../config/global-constants';

@Component({
  selector: 'app-material-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './material-grid.component.html',
  styleUrl: './material-grid.component.scss',
})
export class MaterialGridComponent {
  private _liveAnnouncer = inject(LiveAnnouncer);

  isInsert = false;
  isView = false; 
  isEdit = false; 
  isDelete = false; 
  isStatusChange = true; 

  showLoader = false
  @Input() header: any[] = [];
  @Input() apiURL!: string;
  @Input() actions: string[] = [];
  @Input() source?: string;
  @Input() source2?: string;
  @Input() editURL?: string;
  @Input() deleteURL?: string;
  @Input() statusURL?: string;
  @Input() pageURL?: string;
  @Input() viewURL?: string;

  @Input() addbutton?: string;

  displayedColumns: string[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
        private route: Router,
    private apiService: ApiService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.setPermissions();
    const columnKeys = this.header.map((col) => col.key);
    this.displayedColumns =
      this.actions?.length > 0 ? [...columnKeys, 'actions'] : columnKeys;
    // this.getData();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["apiURL"]) {
      this.dataSource = null
      this.getData()
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Status function
  maintenanceStatus(element: any) {
//     // console.log(element,"Asdasd");
//     if (element.maintainanceDate) {
//       const parts = element.maintainanceDate.split('/');
//       const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00`;
//       element.maintainanceDate = formattedDate;
//   }

//   if (element.status) {
//        element.status = false;
// }
  
    // return
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to change the Status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(element,"SN")
        //this.apiService.put(`${this.statusURL}`, element, { IsStatusChange :this.isStatusChange}).subscribe({
        this.apiService.put(`${this.statusURL}/${element.id}/${this.isStatusChange}`).subscribe({
          next: (data: any) => {
            this.toast.success(data.message)
          this.getData()
          },
          error: (err: any) => {
            this.toast.error(err.error.message)
            console.error('Error fetching data:', err);
          },
        });
      }
    });
  }
      
  // Delete function
  deleteItem(element: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete(`${this.deleteURL}/${element.id}`).subscribe({
          next: (data: any) => {
          this.toast.success(data.message)
          this.getData()
          },
          error: (err: any) => {
            this.toast.error(err.error.message)
            console.error('Error fetching data:', err);
          },
        });
      }
    });
  }

  // Changing the default behaviour to accept multiple
  getData() {
    this.showLoader = true
    this.apiService.get(this.apiURL).subscribe({
      next: (data: any) => {
        let tableData
        // Ensure data is in the correct format
        if (this.source2)
          tableData = data[this.source || 'data'][this.source2] || [];
        else
          tableData = data[this.source || 'data'] || [];
        // Wrap it inside MatTableDataSource
        this.dataSource = new MatTableDataSource(tableData);
        this.showLoader = false
        // Assign paginator and sorting
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      },
      error: (err: any) => {
        console.log("errored out")
        this.toast.error(err.error.message)
        console.error('Error fetching data:', err);
      },
    });
    
  }

  public doFilter = (e: any) => {
    this.dataSource.filter = e.target.value.trim().toLocaleLowerCase();
  };

    private setPermissions(): void {
      const permissions = decryptData(localStorage.getItem(global_const.permission));
      //console.log(permissions,"ad");
      
      // const a:any = localStorage.getItem(global_const.permission);
      // const permissions = JSON.parse(a);
      // const pageName = this.route.url.split('/').pop();
      const pageName = this.route.url.slice(1);
      //console.log(pageName);
  
      for (const e of permissions) {
        // console.log(e.screenDetails.routeLink,this.route.url,"ASd");
        // if (e.screenDetails.routeLink.includes(pageName)) {
  
        // this.isView = true;
        // this.isEdit = true;
        // this.isInsert = true;
        // this.isDelete = true;
        if (e.screenDetails.routeLink == pageName) {
          this.isView = e.view;
          this.isEdit = e.update;
          this.isInsert = e.insert;
          this.isDelete = e.delete;
        }
      }

      //console.log(this.isView,this.isEdit,this.isInsert,this.isDelete,"asd");
      
    }
  
}
