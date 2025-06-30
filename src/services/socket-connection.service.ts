import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { global_const, handle_socket_state } from '../config/global-constants';
import { BehaviorSubject } from 'rxjs';

export interface ChimneyBox {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService {

  private socket!: WebSocket;
  private socketUrl = global_const.socket;
  public chimneys$ = new BehaviorSubject<ChimneyBox[]>([]);

  public isConnected$ = new BehaviorSubject<boolean>(false);
  private chimneysInitialized = false;
  public calibrationRequired$ = new BehaviorSubject<boolean>(false);
  public step1Complete$ = new BehaviorSubject<boolean>(false);
  public step2Complete$ = new BehaviorSubject<boolean>(false);
  
  private parseChimneysObjectToArray(obj: any): ChimneyBox[] {
    return Object.entries(obj).map(([id, data]: [string, any]) => ({
      id: parseInt(id),
      x1: data.box[0],
      y1: data.box[1],
      x2: data.box[2],
      y2: data.box[3],
      lost: data.lost
    }));
  }

  private readonly maxEvents = 10;
  public eventHistory: any[] = [];
  public latestEvent$ = new BehaviorSubject<any>(null);
  private previousDetectedChimneys: string = '';

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.isConnected$.next(true);
      return;
    }

    this.socket = new WebSocket(this.socketUrl);

    this.socket.onopen = () => {
      console.log("WebSocket connected.");
      this.isConnected$.next(true);
    };
    
    // this.socket.onmessage = (event) => {
    //   try {
    //     const data = JSON.parse(event.data);
    //     this.pushToQueue(data)
    //     if (data.event === "calibration_required")
    //       this.calibrationRequired$.next(true)
    //   } catch (err) {
    //     console.error("Error parsing WebSocket message", err);
    //   }
    // };
    //
    // this.socket.onmessage = (event) => {
    //   try {
    //     const data = JSON.parse(event.data);
    //     this.pushToQueue(data);

    //     switch (data.event) {
    //       case "calibration_required":
    //         this.calibrationRequired$.next(true);
    //         const chimneyArray = this.parseChimneysObjectToArray(data.detected_chimneys);
    //         this.chimneys$.next(chimneyArray || []);
    //         break;

    //       case "calibration_complete":
    //         this.calibrationRequired$.next(false);
    //         break;

    //       default:
    //         break;
    //     }
    //   } catch (err) {
    //     console.error("Error parsing WebSocket message", err);
    //   }
    // };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.pushToQueue(data);

        if (data.event === "calibration_required") {
          this.calibrationRequired$.next(true);
          const currentChimneysStr = JSON.stringify(data.detected_chimneys);

          // Only set chimneys once when page/component loads
         if (this.previousDetectedChimneys !== currentChimneysStr) {
            const chimneyArray = this.parseChimneysObjectToArray(data.detected_chimneys);
            this.chimneys$.next(chimneyArray);
            this.previousDetectedChimneys = currentChimneysStr;
          }
          // if (!this.chimneysInitialized && data.detected_chimneys) {
          //   const chimneyArray = this.parseChimneysObjectToArray(data.detected_chimneys);
          //   this.chimneys$.next(chimneyArray);
          //   this.chimneysInitialized = true;
          // }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.isConnected$.next(false);
    };

    this.socket.onclose = () => {
      console.warn("WebSocket closed.");
      this.isConnected$.next(false);
    };
  }
  
  private pushToQueue(event: any): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxEvents) {
      this.eventHistory.shift();  // remove the oldest one
    }
  }

  // Optional utility to expose history
  getRecentEvents(): any[] {
    return [...this.eventHistory];
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  getSocket(): WebSocket | undefined {
    return this.socket;
  }

  sendMessage(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("Socket not open. Cannot send.");
    }
  }
  
  sendDetectedChimneys(selectedChimneys: any[]) {
  const payload = {
    event: "step1",
    chimneys: selectedChimneys
  };
  this.sendMessage(payload);
  this.step1Complete$.next(true);
}

  // Sends manually drawn chimneys from Step 2
  sendManualChimneys(drawnChimneys: any[]) {
    const payload = {
      event: "step2",
      chimneys: drawnChimneys
    };
    this.sendMessage(payload);
    this.step2Complete$.next(true);
  }
  
    /**
   * Tries to reconnect only if server is alive
   */
  async reconnect(): Promise<void> {
    try {
      this.connect();
    } catch (e) {
      console.warn('Server check failed, not reconnecting', e);
    }
  }
  
  requestRecalibration(): void {
    this.sendMessage({ event: 'recalibrate' });
  }

  testConnection(): void {
    const testSocket = new WebSocket(this.socketUrl);
    testSocket.onopen = () => {
      this.isConnected$.next(true);
    };
    testSocket.onerror = () => {
      this.isConnected$.next(false);
    };
  }
  constructor(
  ) {
  }
}
