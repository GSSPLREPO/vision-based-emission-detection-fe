import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { global_const } from '../../../../config/global-constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-live-feed',
  imports: [NgIf, FormsModule],
  templateUrl: './view-live-feed.component.html',
  styleUrl: './view-live-feed.component.scss'
})
export class ViewLiveFeedComponent {
  baseVideoUrl = `${global_const.pyServer}/video-feed`;
  annotatedVideoUrl = `${global_const.pyServer}/frame`;
  baseFeedWorking = false;
  showAnnotated = false;
  error = false;
  retryCounter = 0;

  onBaseLoad() {
    this.baseFeedWorking = true;
    this.error = false;
  }

  onBaseError() {
    this.baseFeedWorking = false;
    this.error = true;
  }

  retry() {
    this.retryCounter++;
    this.baseFeedWorking = false;
    this.error = false;
    this.baseVideoUrl = `${global_const.pyServer}/video-feed?retry=${this.retryCounter}`;
    this.annotatedVideoUrl = `${global_const.pyServer}/frame?retry=${this.retryCounter}`;
  }
}
