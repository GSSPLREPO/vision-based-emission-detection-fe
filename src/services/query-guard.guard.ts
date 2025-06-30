import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const queryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const allowedParams = ['id']; // Define allowed query parameters
  const params = route.queryParamMap;

  // Check if any disallowed query parameter exists
  const hasDisallowedParam = params.keys.some(key => !allowedParams.includes(key));

  if (hasDisallowedParam) {
    return router.createUrlTree(['/error']); // or some other route
  }

  return true;
};

export const noQueryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (route.queryParamMap.keys.length > 0) {
    return router.createUrlTree(['/error']);
  }
  return true;
};