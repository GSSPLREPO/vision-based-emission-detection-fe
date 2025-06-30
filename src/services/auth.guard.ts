// import { CanActivateFn, Router } from '@angular/router';
// import { global_const } from '../config/global-constants';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
  
//   const router = inject(Router)
//   const token = localStorage.getItem(global_const.token)
//   if(!token){
//     router.navigate(['/login']);
//     console.log(false);
//     return false
//   } 
  
//   return true;
// };


import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { global_const } from '../config/global-constants';
import { jwtDecode } from 'jwt-decode'; // ✅ Corrected import
 
function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}
 
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(global_const.token);
 
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(global_const.token);
    router.navigate(['/login']);
    return false;
  }
 
  return true;
};