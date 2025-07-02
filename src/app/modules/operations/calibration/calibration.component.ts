import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChimneyBox, SocketConnectionService } from '../../../../services/socket-connection.service';
import { global_const } from '../../../../config/global-constants';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibration',
  imports: [ FormsModule, NgFor, NgIf, NgStyle ],
  templateUrl: './calibration.component.html',
  styleUrl: './calibration.component.scss'
})
export class CalibrationComponent{
    chimneys: ChimneyBox[] = [];
  selected: { [id: number]: boolean } = {};
  names: { [id: number]: string } = {};
  videoFeedUrl = `${global_const.pyServer}/frame`

  @ViewChild('overlayCanvas', { static: true }) overlayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLImageElement>;

  constructor(
    private socketService: SocketConnectionService,
    private router: Router
  ) {
    // this.socketService.chimneys$.subscribe(chimneys => {
    //   this.chimneys = chimneys;
    //   this.selected = {};
    //   this.names = {};
    //   chimneys.forEach(c => {
    //     this.selected[c.id] = false;
    //     this.names[c.id] = '';
    //   });
    // });
    
    this.socketService.chimneys$.subscribe(chimneys => {
      const currentIds = new Set(this.chimneys.map(c => c.id));
      const newIds = new Set(chimneys.map(c => c.id));

      const isDifferent =
        this.chimneys.length !== chimneys.length ||
        [...newIds].some(id => !currentIds.has(id));

      if (isDifferent) {
        this.chimneys = chimneys;

        // Only add new chimneys without resetting user selections
        chimneys.forEach(ch => {
          if (!(ch.id in this.selected)) {
            this.selected[ch.id] = false;
            this.names[ch.id] = '';
          }
        });

        // Optionally remove chimneys that no longer exist
        Object.keys(this.selected).forEach(id => {
          if (!newIds.has(Number(id))) {
            delete this.selected[Number(id)];
            delete this.names[Number(id)];
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupCanvasOverlay();
  }

  setupCanvasOverlay() {
    const canvas = this.overlayCanvas.nativeElement;
    const img = this.videoElement.nativeElement;

    const updateCanvasSize = () => {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
    };

    setInterval(() => {
      updateCanvasSize();
      this.drawOverlay();
    }, 1000);
  }

  drawOverlay() {
    const canvas = this.overlayCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = this.videoElement.nativeElement;
    const scaleX = img.clientWidth / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;

    this.chimneys.forEach(ch => {
      if (this.selected[ch.id]) {
        const x = ch.x1 * scaleX;
        const y = ch.y1 * scaleY;
        const width = (ch.x2 - ch.x1) * scaleX;
        const height = (ch.y2 - ch.y1) * scaleY;

        ctx.strokeStyle = 'limegreen';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.fillRect(x, y, width, height);
      }
    });
  }

  onCheckboxChange() {
    this.drawOverlay();
  }

  submitChimneys() {
    const selectedChimneys = this.chimneys
      .filter(ch => this.selected[ch.id])
      .map(ch => ({
        id: ch.id,
        x1: ch.x1,
        y1: ch.y1,
        x2: ch.x2,
        y2: ch.y2,
        name: this.names[ch.id]
      }));

    this.socketService.sendDetectedChimneys(selectedChimneys);
    this.router.navigate(['/operation/calibration-step2'])
    alert('Selected chimneys sent to backend');
  }
}
