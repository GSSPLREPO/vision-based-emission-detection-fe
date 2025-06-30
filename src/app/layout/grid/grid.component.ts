import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Grid, h } from 'gridjs';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef;

  limit: number = 10;
  gridInstance!: Grid; // Properly type the Grid instance
  tableData: any[] = [];
  @Input() header?: any[];
  @Input() apiURL?: string;
  @Input() dataSource?: string;
  @Input() editURL?: string;
  @Input() deleteURL?: string;
  @Input() pageURL?: string;
  @Input() viewURL?: string;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.apiService.get(this.apiURL || '').subscribe({
      next: (data: any) => {
        this.tableData = data[this.dataSource || 'data'].map((item: any) => [
          item.id,
          item.name,
        ]);
        this.initializeGrid();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  initializeGrid(): void {
    this.gridInstance = new Grid({
      columns: [
        ...(this.header || []),
        {
          name: 'Actions',
          width: '150px',
          formatter: (_, row) => {
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px', // Adds spacing between buttons
                  height: '100%'
                }
              },
              [
                h(
                  'button',
                  {
                    className: 'btn btn-edit',
                    onClick: () => {
                      alert(`Edit ID: ${row.cells[0].data}`);
                    },
                    title: 'Edit Item' // Tooltip
                  },
                  h('i', { className: 'fas fa-pen', title: 'Edit' })
                ),
                h(
                  'button',
                  {
                    className: 'btn btn-delete',
                    onClick: () => {
                      alert(`Delete ID: ${row.cells[0].data}`);
                    },
                    title: 'Delete Item' // Tooltip
                  },
                  h('i', { className: 'fas fa-trash tamatar', title: 'Delete' })
                )
              ]
            );
          }
        }
        
        
      ],
      pagination: { summary: true, limit: this.limit },
      search: true,
      sort: true,
      style: {
        td: {
          border: '1px solid #ccc',
        },
        th: {
          border: '1px solid #ccc',
          color: '#000',
          'font-size': '18px',
          'text-align': 'center',
        },
        table: {
          'font-size': '15px',
        },
      },
      resizable: true,
      data: this.tableData,
    }).render(this.gridContainer.nativeElement);
  }

  updateLimit(): void {
    // Get the search input value before destroying the grid
    let searchValue = '';

    if (this.gridContainer && this.gridContainer.nativeElement) {
      const searchInput = this.gridContainer.nativeElement.querySelector(
        '.gridjs-search-input'
      );
      if (searchInput) {
        searchValue = searchInput.value;
      }
    }

    // Destroy and recreate the grid
    if (this.gridInstance) {
      this.gridInstance.destroy();
      this.initializeGrid();

      // Re-apply search if needed
      if (searchValue) {
        setTimeout(() => {
          if (this.gridContainer && this.gridContainer.nativeElement) {
            const newSearchInput =
              this.gridContainer.nativeElement.querySelector(
                '.gridjs-search-input'
              );
            if (newSearchInput) {
              newSearchInput.value = searchValue;
              // Trigger the search event
              newSearchInput.dispatchEvent(new Event('input'));
            }
          }
        }, 0);
      }
    }
  }
}
