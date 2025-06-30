import { CanActivateFn, Router } from '@angular/router';
import { global_const } from '../config/global-constants';
import { inject } from '@angular/core';
import { decryptData } from './utils';
import { ToastrService } from 'ngx-toastr';

export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastrService)

  // Get the stored encrypted permissions and decrypt them
  const storedPermissions = localStorage.getItem(global_const.permission);
  const permissions = storedPermissions ? decryptData(storedPermissions) : null;
  
  // Get the page name from the route URL
  let a = state.url.slice(1);
  let pageName = a
  if(a.includes('/form')){
    const result = a.split('/form')[0] + '/form';
    pageName = result
  }
  if(a.includes('/edit')){
    const result = a.split('/edit')[0] + '/edit';
    pageName = result
  }


  console.log('Attempted Page:', pageName);

  // If no permissions found, redirect to login page
  // if (!permissions) {
  //   router.navigate(['/login']);
  //   return false; 
  // }


  let routerLinks:any = []
  for (const element of permissions) {
    if(element.insert || element.update){
      if(element.screenDetails.routeLink == "masters/sales-scrap-discard"){
        routerLinks.push(element.screenDetails.routeLink+'/edit')
      }
      routerLinks.push(element.screenDetails.routeLink+'/form')
    }
    if(element.screenDetails.routeLink == "masters/cwip-entry"){
      routerLinks.push(element.screenDetails.routeLink+'/excel-upload')
      
    }
    routerLinks.push(element.screenDetails.routeLink)
  }
  
  // const routeLinks = permissions.map((e:any) => e.screenDetails.routeLink);

if (!routerLinks.includes(pageName)) {
  // console.log("here");
  toast.error('Access Denied')
  router.navigate(['/login']);
  console.log("not here");
} 
  // Check if the user has permission for the specific page (implement permission logic here)
  // let arr:any = []
  // for (const e of permissions) {
  //   arr.push(e.screenDetails.routeLink)
  //   // if (pageName != e.screenDetails.routeLink) { 

  //   //   if(!e.view){
  //   //     router.navigate(['/login']);
  //   //     return false;
  //   //   }
  //   // }
  // }


  return true; // Allow access if permissions exist and match
};
