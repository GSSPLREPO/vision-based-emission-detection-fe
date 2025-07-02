import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ReusableAPIService } from '../../../services/reusable-api.service';
import { Modal } from 'bootstrap';
import { global_const, version } from '../../../config/global-constants';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-body',
    standalone: true,
    templateUrl: './body.component.html',
    styleUrl: './body.component.scss',
    imports: [CommonModule, RouterOutlet, RouterLink]
})
export class BodyComponent {

  @ViewChild('subscriptionModel') subscriptionModel!: ElementRef;
  routeArray: string[] = [];
  @Input() collapsed:any;
  @Input() screenWidth:any;
  currentYear: number = new Date().getFullYear(); //Rahul: added 'currentYear' 20-01-2025 
  version: string = ""
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,     
    private titleService: Title,
    private apiService: ApiService,
    private reusableService: ReusableAPIService) {
    router.events.subscribe((url: any) => {

      // Before adding edit screen in sales/scrap 

      // if (url.url) {
      //   // let r = url.url.split('/')
      //   // this.routeArray = r.filter((data: any) => data != "" && data != "form" )
      //   let r = url.url.split('/');
      //   let formIndex = r.indexOf("form");

      //   // If "form" is found, slice the array up to the index of "form"
      //   if (formIndex !== -1) {
      //     r = r.slice(0, formIndex);
      //   }

      //   this.routeArray = r.filter((data: any) => data != "");

      // }

      // Updated code after edit screen in sales/scrap

      if (url.url) {
        let r = url.url.split('/');
        let formIndex = r.indexOf("form");
        let editIndex = r.indexOf("edit");
        let viewIndex = r.indexOf("view");
      
        // Find the first occurrence of either "form" or "edit"
        let sliceIndex = -1;
      
        if (formIndex !== -1 && editIndex !== -1 && viewIndex == -1) {
          sliceIndex = Math.min(formIndex, editIndex);  // If both are found, take the smaller index
        } else if (formIndex !== -1) {
          sliceIndex = formIndex;
        } else if (editIndex !== -1) {
          sliceIndex = editIndex;
        }else if (viewIndex !== -1) {
          sliceIndex = viewIndex;
        }
      
        // If either "form" or "edit" is found, slice the array up to that index
        if (sliceIndex !== -1) {
          r = r.slice(0, sliceIndex);
        }
      
        this.routeArray = r.filter((data: any) => data !== "");
      }
    });
    
    effect(() => {
      this.version = version()
    })

    this.version = localStorage.getItem("version") || ""
  }

  ngOnInit(){
    // this.getServerTime()
  //   const modal = new Modal(this.subscriptionModel.nativeElement, {
  //     backdrop: 'static',
  //     keyboard: false
  // });

  // modal.show();
  }

  daysRemaining:number = 0
  showModel:any = localStorage.getItem('tempModel')
  getServerTime(){
    this.reusableService.getServerTime().subscribe({
      next: (data:any)=>{
        const modal = new Modal(this.subscriptionModel.nativeElement, {
          backdrop: 'static',
          keyboard: false
      });
        this.daysRemaining = data.data.remainingDays

        if(!this.showModel){
          localStorage.setItem('tempModel',JSON.stringify(true))
        }else{
          let a:any = (localStorage.getItem('tempModel'))
          if(JSON.parse(a)){
            switch (this.daysRemaining) {
              case 30:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break;
              case 15:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break
                case 5:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break
                case 4:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break
                case 3:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break
                case 2:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break
                case 1:
                localStorage.setItem('tempModel',JSON.stringify(false))
                modal.show();
                break

            }
          }
        }
      }
    })
  }



  capitalize(s:any) {
     
    if( s =='role-right'){
      s = 'Role Rights'
      this.titleService.setTitle(`${global_const.org_name}-${s} `);
      return s
    }
    
    if( s =='about'){
      s = 'About Us'
      this.titleService.setTitle(`${global_const.org_name}-${s} `);
      return s
    }
   
    if (typeof s !== 'string') return '';
   
    // Replace hyphens with spaces
    s = s.replace(/-/g, " ");

    // Capitalize the first letter of each word
    s = s.split(' ').map((word:any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    this.titleService.setTitle(`${global_const.org_name}-${s} `);
    return s;
}

// ngAfterViewInit() {
//   // const modalElement = document.getElementById('assignLocation');
//   // if (modalElement) {
//       const modal = new Modal(this.subscriptionModel.nativeElement, {
//           backdrop: 'static',
//           keyboard: false
//       });
//       modal.show();
//   // }
// }


// openModal() {
//   const modal = new bootstrap.Modal(this.subscriptionModel.nativeElement);
//   modal.show();
// }


  getBodyClass(): string {
    let styleClass = 'body-trimmed'; 
    if (this.screenWidth > 768) {
      if(this.collapsed){
        styleClass = 'body-trimmed';
      }else{
        styleClass = 'body-md-screen';
      }
    }
    else{
        styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  getFooterClass(): string {
    let styleClass = 'footer-trimmed'; 
    if (this.screenWidth > 768) {
      if(this.collapsed){
        styleClass = 'footer-trimmed';
      }else{
        styleClass = 'footer-md-screen';
      }
    }
    else{
        styleClass = 'footer-md-screen';
    }
    return styleClass;
  }

  getCurrentRoute(): string[] {
    let route = this.route.snapshot;
    let routeArray = [];

    while (route.firstChild) {
      route = route.firstChild;
      routeArray.push(route.url.map(segment => segment.path).join('/'));
    }

    return routeArray;
  }
}
