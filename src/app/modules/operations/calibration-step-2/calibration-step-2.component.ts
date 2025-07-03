import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { global_const } from '../../../../config/global-constants';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { SocketConnectionService } from '../../../../services/socket-connection.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calibration-step-2',
  imports: [ FormsModule, NgFor ],
  templateUrl: './calibration-step-2.component.html',
  styleUrl: './calibration-step-2.component.scss'
})
export class CalibrationStep2Component implements OnInit {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgRef') imgRef!: ElementRef<HTMLImageElement>;
  
  private socket_con = inject(SocketConnectionService)
  latestChimneyId = 0;
  
  constructor(
    private toastr: ToastrService,
    private router: Router
  )
  {}
  ngOnInit(): void {
  this.socket_con.chimneys$.subscribe(chimneys => {
    if (chimneys && chimneys.length > 0) {
      const maxId = Math.max(...chimneys.map(c => c.id));
      this.latestChimneyId = maxId;
    }
  });
}
  
  ctx!: CanvasRenderingContext2D;
  isDrawing = false;

  startX = 0;
  startY = 0;
  scaleFactor = 1; 

  currentBox = { x1: 0, y1: 0, x2: 0, y2: 0 };

  drawnBoxes: { x1: number, y1: number, x2: number, y2: number, label: string }[] = [];

  annotated_feed = `${global_const.pyServer}/frame`;  // Replace with your stream URL

  ngAfterViewInit(): void {
    this.setCanvasSize();
  }

  onImageLoad() {
    this.setCanvasSize();
  }
  
  setCanvasSize() {
    const img = this.imgRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const displayedWidth = img.clientWidth;
    const naturalWidth = img.naturalWidth;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    this.scaleFactor = naturalWidth/displayedWidth;
    this.ctx = canvas.getContext('2d')!;
    this.redrawCanvas();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = (event.clientX - rect.left) * this.scaleFactor;
    this.startY = (event.clientY - rect.top) * this.scaleFactor;
    this.isDrawing = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * this.scaleFactor;
    const y = (event.clientY - rect.top) * this.scaleFactor;

    this.currentBox = {
      x1: this.startX,
      y1: this.startY,
      x2: x,
      y2: y
    };

    this.redrawCanvas();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    // this.drawnBoxes.push({ ...this.currentBox, label: '' });
    this.drawnBoxes.push({
      x1: Math.round(this.currentBox.x1),
      y1: Math.round(this.currentBox.y1),
      x2: Math.round(this.currentBox.x2),
      y2: Math.round(this.currentBox.y2),
      label: ''
    });
    this.currentBox = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.redrawCanvas();
  }
  
  redrawCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw drawn boxes
    this.drawnBoxes.forEach(box => {
      this.ctx.strokeStyle = 'blue';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        box.x1 / this.scaleFactor,
        box.y1 / this.scaleFactor,
        (box.x2 - box.x1) / this.scaleFactor,
        (box.y2 - box.y1) / this.scaleFactor
      );
    });

    // Draw current drawing box
    if (this.isDrawing) {
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        this.currentBox.x1 / this.scaleFactor,
        this.currentBox.y1 / this.scaleFactor,
        (this.currentBox.x2 - this.currentBox.x1) / this.scaleFactor,
        (this.currentBox.y2 - this.currentBox.y1) / this.scaleFactor
      );
    }
  }

  // redrawCanvas() {
  //   const canvas = this.canvasRef.nativeElement;
  //   this.ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   // Draw existing boxes
  //   this.drawnBoxes.forEach(box => {
  //     this.ctx.strokeStyle = 'blue';
  //     this.ctx.lineWidth = 2;
  //     this.ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
  //   });

  //   // Draw current drawing box
  //   if (this.isDrawing) {
  //     this.ctx.strokeStyle = 'red';
  //     this.ctx.strokeRect(
  //       this.currentBox.x1,
  //       this.currentBox.y1,
  //       this.currentBox.x2 - this.currentBox.x1,
  //       this.currentBox.y2 - this.currentBox.y1
  //     );
  //   }
  // }

  submitDrawnBoxes() {
    const labeledBoxes = this.drawnBoxes.filter(box => box.label.trim() !== '')
    .map((box, index) => ({
      id: this.latestChimneyId + index + 1,
      x1: Math.round(box.x1),
      y1: Math.round(box.y1),
      x2: Math.round(box.x2),
      y2: Math.round(box.y2),
      name: box.label.trim()
    }));
    console.log('Sending labeled drawn boxes:', labeledBoxes);
    this.socket_con.sendMessage({ event: "step2", chimneys: labeledBoxes })
    this.toastr.success("Calibration Successful")
    this.router.navigate(["/operation/annotated"])
  }
}
