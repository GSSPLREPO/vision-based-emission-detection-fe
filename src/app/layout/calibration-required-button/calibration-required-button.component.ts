import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { Subscription, combineLatest } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calibration-required-button',
  imports: [NgIf, RouterLink],
  templateUrl: './calibration-required-button.component.html',
  styleUrl: './calibration-required-button.component.scss'
})
export class CalibrationRequiredButtonComponent {

  is_connected: boolean = false
  calibrationRequired = false;

  private subscriptions: Subscription = new Subscription();

  constructor(private wsService: SocketConnectionService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.wsService.isConnected$.subscribe(status => this.is_connected = status)
    );

    this.subscriptions.add(
      this.wsService.calibrationRequired$.subscribe(required => this.calibrationRequired = required)
    );  
  }
  
  show_queue()
  {
    console.log(this.wsService.eventHistory)
    this.toastr.show("Starting calibration")
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onStartCalibration(): void {
    // Logic to trigger calibration UI steps
    console.log("Starting calibration process");
  }
}
