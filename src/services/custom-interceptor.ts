import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { global_const } from '../config/global-constants';
import { ApiService } from './api.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router)
  const client = inject(ApiService)
  const token = localStorage.getItem(global_const.token)
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization : `Bearer ${token}`
    }
  })
  
  return next(cloneRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem(global_const.token)
        router.navigate(['/login']);
        client.logout()
      }
      return throwError(()=>error);
    })
  );

  // return next(cloneRequest);
};
