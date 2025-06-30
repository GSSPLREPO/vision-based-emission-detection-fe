import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { BodyComponent } from "../body/body.component";

@Component({
    selector: 'app-main-layout',
    standalone: true,
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss',
    imports: [RouterOutlet, SidenavComponent, BodyComponent]
})
export class MainLayoutComponent {
  isSideNavCollapsed = true;
  screenWidth = window.innerWidth;

  onToggleSideNav(data: any): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
