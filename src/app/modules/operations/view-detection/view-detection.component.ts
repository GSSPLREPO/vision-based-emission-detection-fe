import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-detection',
  imports: [NgIf],
  templateUrl: './view-detection.component.html',
  styleUrl: './view-detection.component.scss'
})
export class ViewDetectionComponent {
  videoUrl = 'http://localhost:8001/frame';
  hasError = false;
  retryCounter = 0;

  onLoad() {
    this.hasError = false;
    this.retryCounter = 0;
  }

  onError() {
    this.hasError = true;
  }

  retry() {
    this.retryCounter++;
    // Add cache-busting parameter to force re-fetch
    this.videoUrl = `http://localhost:8000/frame?retry=${this.retryCounter}`;
    this.hasError = false;
  }
}
