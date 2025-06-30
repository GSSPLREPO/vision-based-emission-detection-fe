import { HostListener, Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, fromEvent, map, merge, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private connectivityStatus = signal(false)
  constructor() {
    // this.connectivityStatus.set(navigator.onLine)
    // console.log(this.connectivityStatus(),"asas");
    window.addEventListener('online', () => {
      // this._isOnline.set(true);
      console.log("Became online")
    });

    window.addEventListener('offline', () => {
      // this._isOnline.set(false);
      console.log("Became offline")
    });
    // this.checkInitialConnection();
  }

}
