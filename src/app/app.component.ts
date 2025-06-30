import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import moment from 'moment-timezone';
import { ConnectivityService } from '../services/connectivity.service';
import { ReusableAPIService } from '../services/reusable-api.service';
import { GridComponent } from "./layout/grid/grid.component";
import { MaterialGridComponent } from './layout/material-grid/material-grid.component';
import { ApiService } from '../services/api.service';
import { remove_tokens } from '../config/global-constants';
import { InactivityService } from '../services/inactivity.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'nox-detection-fe';
  
  ngOnDestroy(): void {
    remove_tokens()
    this.apiSevice.logout()
  }

  constructor(
    private connectivityService: ConnectivityService,
    private reusableService: ReusableAPIService,
    private apiSevice: ApiService,
    private inactivityService: InactivityService
  ) {}
  isSideNavCollapsed = false;
  screenWidth = 0;

  isOnline!: boolean;


  ngOnInit() {
    
  }
  onToggleSideNav(data: any): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
