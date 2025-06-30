import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { fadeInOut } from '../sidenav/helper';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './tree-view.component.html',
  styleUrl: '../sidenav/sidenav.component.scss',
  animations: [
    fadeInOut,
      trigger('submenu', [
        state('hidden', style({
          height: '0',
          overflow: 'hidden'
        })),
        state('visible', style({
          height: '*'
        })),
        transition('visible <=> hidden', [style({overflow: 'hidden'}), 
          animate('{{transitionParams}}')]),
        transition('void => *', animate(0))
      ])
    ]
})
export class TreeViewComponent {
  @Input() data: any = {
    routeLink: '',
    icon: '',
    label: '',
    items: []
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
  }

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for(let modelItem of this.data.items) {
          if (item !==modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }
  isLinkActive(routeLink: string): boolean {
    // Check if the current URL starts with the given routeLink
    return this.router.url.startsWith(routeLink);
  }

  getActiveClass(item: any): string {
    return item.expanded && this.router.url.includes(item.routeLink) 
      ? 'active-sublevel' 
      : '';
  }

}
