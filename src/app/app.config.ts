import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from '../services/custom-interceptor';
import { provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withHashLocation()), 
    // provideToastr(),
    provideToastr({
      timeOut: 10000,
      // positionClass: 'toast-top-center',
      preventDuplicates: true,
    }), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([customInterceptor])), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ]
};
