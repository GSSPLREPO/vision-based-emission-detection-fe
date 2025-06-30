// inactivity.service.ts
import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service'; // adjust path as needed
import { Router } from '@angular/router';
import { global_const } from '../config/global-constants';
import { Toast } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
 
@Injectable({ providedIn: 'root' })
export class InactivityService {
  private timeoutInMs = 30 * 60 * 1000; // 30 minutes
  private timer: any;
  private apiService = inject(ApiService)
  private toast = inject(ToastrService)

  constructor(private router: Router) {
    this.resetTimer();
    this.listenToUserActivity();
  }
 
  private listenToUserActivity() {
    ['click', 'mousemove', 'keypress', 'scroll'].forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }
 
  private resetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.logout(), this.timeoutInMs);
  }
 
  private logout() {
    this.apiService.get("/api/Login/Logout").subscribe({
        next: () => {
            // console.log("Logged out")
            this.toast.success("Session Timed Out")
            localStorage.removeItem(global_const.token);
        }
    })
    this.router.navigate(['/login']);
  }
}