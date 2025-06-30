import { Component, ElementRef, AfterViewInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons/js/dataTables.buttons.min';
import 'datatables.net-buttons/js/buttons.html5.min';
import 'datatables.net-buttons/js/buttons.print.min';
import 'datatables.net-buttons/js/buttons.colVis.min';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { global_const } from '../../../config/global-constants';
import { decryptData } from '../../../services/utils';

@Component({
  selector: 'app-common-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.scss'] // Fix typo here
})
export class CommonGridComponent implements AfterViewInit {
  editBtn = '<button class="btn btn-edit"title="Edit"><i class="fas fa-pen"></i></button>';
  deleteBtn = '<button class="btn btn-delete"title="Delete"><i class="fas fa-trash tamatar"></i></button>';
  delinkBtn = '<button class="btn btn-delink" title="De Link"><i class="fa-solid fa-link-slash"></i></button>'
  viewBtn = '<button class="btn btn-view"title="view"><i class="fas fa-eye"></i></button>';
  amendBtn = '<button class="btn btn-amendment"title="Amend"><i class="fa-solid fa-file-signature"></i></button>';
  isInsert = false;
  isView = false; 
  isEdit = false; 
  isDelete = false; 

  @ViewChild('example', { static: false }) example!: ElementRef;
  @Input() header: any;
  @Input() apiURL?: string;
  @Input() dataSource?: string;
  @Input() editURL?: string;
  @Input() deleteURL?: string;
  @Input() pageURL?: string;
  @Input() viewURL?: string;
  @Input() amendmentURL?: string;
  
  @Input() addbutton?: string;
  @Input() bulkUploadURL?: string;
  @Input() bulkUploadButton?: string;

  private dataTable: any;

  constructor(
    private http: HttpClient,
    private route: Router,
    private toast: ToastrService
  ) { }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  ngOnInit() {
    this.setPermissions();
    this.configureActionButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiURL'] && !changes['apiURL'].isFirstChange()) {
      this.reloadDataTable();
    }
    if (changes['dataSource'] && !changes['dataSource'].isFirstChange()) {
      this.reloadDataTable();
    }
  }

  private setPermissions(): void {
    const permissions = decryptData(localStorage.getItem(global_const.permission));
    // const a:any = localStorage.getItem(global_const.permission);
    // const permissions = JSON.parse(a);
    // const pageName = this.route.url.split('/').pop();
    const pageName = this.route.url.slice(1);


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
  }

  private configureActionButtons(): void {

    this.header.forEach((element:any) => {

      if (element.title === 'Action' || element.title === 'Actions') {
        element.defaultContent = this.createActionButtons(element);
      }
    });    
    if(!this.isEdit && !this.isDelete &&  !this.isView){
      this.header.pop()
    }    
  }

  private createActionButtons(element: any): string {
    return `
      <div class="d-flex justify-content-center">
        ${this.isView && element.data.includes('view') ? this.viewBtn : ''}
        ${this.isEdit && element.data.includes('amendment') ? this.amendBtn : ''}
        ${this.isEdit && element.data.includes('update') ? this.editBtn : ''}
        ${this.isEdit && element.data.includes('delink') ? this.delinkBtn : ''}
        ${this.isDelete && element.data.includes('delete') ? this.deleteBtn : ''}
      </div>
    `;
  }
  


  private initializeDataTable(): void {  
    const token = localStorage.getItem('token');  
    
      // Check if DataTable is already initialized to avoid duplication
  if ($.fn.DataTable.isDataTable(this.example.nativeElement)) {
    this.dataTable.destroy();  // Destroy the existing instance if necessary
  }
  //console.log("HeaderLength: " + this.header.length)
    this.dataTable = ($(this.example.nativeElement) as any).DataTable({
      processing: true,
      ajax: {
        url: `${environment.apiUrl}/${this.apiURL}`,
        type: 'GET',
        beforeSend: (request: any) => {
          if (token) {
            request.setRequestHeader('Authorization', `Bearer ${token}`);
          }
        },
        dataSrc: this.getDataSource(),
        error: (xhr: any) => this.handleAjaxError(xhr),
      },
      columns: this.header,
      pageLength: 10,
      deferRender: true,
      language: {
        emptyTable: "No data available in table",  
        zeroRecords: "No records to display", 
      },
      scrollX:this.header?.length > 15?true:false,
      columnDefs: [
        { targets: 0, className: 'text-center' } // Always center first column
      ],
      drawCallback: function () {
        $('th').css('text-align', 'center');
      },
    });

    this.setupRowActions();
  }
 

  // private getDataSource() {
  //   return (json: any) => {
  //       // If dataSource is already an array, return it directly
  //   if (Array.isArray(this.dataSource)) {
  //     return this.dataSource;
  //   }    
  //     const keys = this.dataSource?.split('.') || [];
  //     // const keys = this.dataSource?.split('.') || [];
  //     let result = json;

  //     for (const key of keys) {
  //       if (result && typeof result === 'object' && key in result) {
  //         result = result[key];
  //       } else {
  //         console.error('Invalid dataSource path:', this.dataSource);
  //         return [];
  //       }
  //     }

  //     return Array.isArray(result) ? result : [];
  //   };
  // }



  private getDataSource() {
    return (json: any) => {
      if (Array.isArray(this.dataSource)) {
        // If dataSource is an array, directly use it without parsing
        return this.dataSource;
      } else if (typeof this.dataSource === 'string') {
        // If dataSource is a string, treat it as a dot-separated path
        const keys = this.dataSource.split('.');
        let result = json;

        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            console.error('Invalid dataSource path:', this.dataSource);
            return [];
          }
        }

        return Array.isArray(result) ? result : [];
      }
      return [];
    };
  }

  private handleAjaxError(xhr: any): void {
    if (xhr.status === 401) {
      this.route.navigateByUrl('login');
    } else if (xhr.status === 400) {
      const errorResponse = xhr.responseJSON;
      if (errorResponse && errorResponse.errors) {
        const errorMessages = Object.values(errorResponse.errors).flat() as string[];
        errorMessages.forEach((message) => {
          this.toast.error(message);
        });
      } 
    //   else {
    //   this.toast.error('Bad request. Please check your input.');
    // }
    } else {
      console.error('AJAX error:', xhr);
     // this.toast.error('An unexpected error occurred. Please try again later.');
    }
  }

  private setupRowActions(): void {

    $(this.example.nativeElement).on('click', 'button.btn-view', (event) => {
      const data = this.dataTable.row($(event.currentTarget).parents('tr')).data();      
      this.route.navigateByUrl(`${this.viewURL}/${data.id}`);
    });

    $(this.example.nativeElement).on('click', 'button.btn-amendment', (event) => {
      const data = this.dataTable.row($(event.currentTarget).parents('tr')).data();      
      this.route.navigateByUrl(`${this.editURL || this.pageURL}/${data.id}?isAmend=1`);
    });

    $(this.example.nativeElement).on('click', 'button.btn-edit', (event) => {
      const data = this.dataTable.row($(event.currentTarget).parents('tr')).data();
      this.route.navigateByUrl(`${this.editURL || this.pageURL}/${data.id}`);
    });

    $(this.example.nativeElement).on('click', 'button.btn-delink', (event) => {
      const data = this.dataTable.row($(event.currentTarget).parents('tr')).data();
      this.route.navigateByUrl(`${this.editURL || this.pageURL}/${data.id}?isDelink=1`);
    });

    $(this.example.nativeElement).on('click', 'button.btn-delete', (event) => {
      const data = this.dataTable.row($(event.currentTarget).parents('tr')).data();
      this.confirmDeletion(data);
    });
  }

  private confirmDeletion(data: any): void {
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
        this.deleteItem(data.id);
      }
    });
  }

  private deleteItem(id: string): void {
    const currentPage = this.dataTable.page();
    this.http.delete(`${environment.apiUrl}/${this.deleteURL}/${id}`).subscribe({
      next: (data:any) => {
        this.toast.success(data.message)
        this.dataTable.ajax.reload(() => {
          this.dataTable.page(currentPage).draw(false);
        });
      },
      error: (err: any) => {
        this.toast.error(err.error.message);
      }
    });
  }

  private reloadDataTable(): void {

    if (this.dataTable) {
      this.dataTable.clear().destroy();
      this.initializeDataTable();
    }
  }
}