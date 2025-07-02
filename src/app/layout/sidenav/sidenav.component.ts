import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { fadeInOut, INavbarData } from './helper';
import { commonData, inventoryData, navbarData } from './nav-data';
import { global_const, label, remove_tokens } from '../../../config/global-constants';
import Swal from 'sweetalert2';
import { ApiService } from '../../../services/api.service';
import { buildHierarchy, decryptData, encryptData } from '../../../services/utils';
import { ReusableAPIService } from '../../../services/reusable-api.service';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { Subscription } from 'rxjs';
import { CalibrationRequiredButtonComponent } from '../calibration-required-button/calibration-required-button.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
  imports: [CommonModule, RouterLink, RouterLinkActive, TreeViewComponent, CalibrationRequiredButtonComponent],
})
export class SidenavComponent implements OnDestroy {
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  // navData:any = navbarData;

  commonData: any;
  multiple: boolean = false;
  userEmail = localStorage.getItem('email');
  organization_name: any;
  showDropdown = false;
  connection_status: WritableSignal<boolean> = signal(false)
  private connectionSub!: Subscription;
  label: string = "Süd-Chemie"

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(
    public router: Router,
    private apiService: ApiService,
    private elementRef: ElementRef,
    public reusable: ReusableAPIService,
    private socket: SocketConnectionService
  ) {
    effect(() => {
      this.label = label()
    })
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
  

  ngOnInit(): void {
    this.socket.connect()
    this.connectionSub = this.socket.isConnected$.subscribe(status => {
      this.connection_status.set(status);
    });

    this.getOrganigation();
    this.screenWidth = window.innerWidth;
    const permissions = decryptData(localStorage.getItem(global_const.permission));
    
    let data = permissions.map((data:any) => data.screenDetails)
    
    // let commonData = []
    // const categorizedData = this.screenNames.reduce(
    //   (acc: any, screen: any) => {


    // Build the hierarchy for each category

    this.commonData = buildHierarchy(data);
    //console.log(this.commonData)
    // this.getMenu()
    // this.getAllScreens();
    // this.getRights();
    // let a = localStorage.getItem('organization')
    // if(a){
    //   let organization = JSON.parse(a)
    //   this.organization_name = organization.name
    //   console.log(this.organization_name,"sadasd");

    // }
  }

  getOrganigation() {
    this.apiService.get(`/api/Organization/GetAllOrganizations`).subscribe({
      next: (data: any) => {
        let a = localStorage.setItem(
          'organization',
          JSON.stringify(data.data.organization[0])
        );
        this.organization_name = data.data.organization[0].name;
        label.set(data.data.organization[0].organizationLabel)
      },
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: any): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: any): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: any): void {
    this.collapsed = true;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
    if (!this.multiple) {

      for (let modelItem of this.commonData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }

    }
  }
  
  reconnect() {
    if (!this.connection_status()) {
      this.socket.reconnect();
    }
  }
  
  ngOnDestroy(): void {
    this.connectionSub?.unsubscribe();
  }

  onConnectionIconClick(): void {
    // Try to reconnect/test if down
    this.socket.testConnection();
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.get("/api/Login/Logout")
        .subscribe({
          next: () => {
            remove_tokens()
            this.router.navigate(['/login']);            
          },
          error: () => {
            console.log("Unable to call the API")
          }
        })
      }
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }
}
