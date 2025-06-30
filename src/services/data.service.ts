import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service available throughout the app
})
export class DataService {
  private dataSource = new BehaviorSubject<string>('Default Data');
  currentData = this.dataSource.asObservable();

  constructor() {}

  changeData(data: string) {
    this.dataSource.next(data);
  }
}
