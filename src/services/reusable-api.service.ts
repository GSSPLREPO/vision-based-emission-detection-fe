import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReusableAPIService {

  userName = signal(localStorage.getItem('userName'))
  org1:any = localStorage.getItem('organization')
  org = JSON.parse(this.org1)
  
  organizationName = signal(this.org?.name || null)
  constructor(
    private apiService: ApiService,
  ) {
    // console.log(this.org,"a");

   }

  // getAllSections(): Observable<any> {
  //   return this.apiService.get(`/api/Section/GetAllSections`);
  // }

  getServerTime(): Observable<any> {
    return this.apiService.get(`/api/Login/GetServerDateTime`);
  }

  // //Cascade of every module take reference from this methods
  // //Modules : Dashboard
  // getAllSections(): Observable<any> {
  //   return this.apiService.get(`/api/Dashboard/GetAllSectionsForDashboard`);
  // }

  // getAllAreaBySectionId(e:any): Observable<any> {
  //   return this.apiService.get(`/api/Dashboard/GetAllAreaBySectionIdForDashboard/${e}`);
  // }

  // getAllZoneByAreaId(e:any): Observable<any> {
  //   return this.apiService.get(`/api/Dashboard/GetAllZoneByAreaIdForDashboard/${e}`);
  // }

  // getAllAisleByZoneId(e:any): Observable<any> {
  //   return this.apiService.get(`/api/Dashboard/GetAllAisleByZoneIdForDashboard/${e}`);
  // }

  // getAllRackByAsileId(e:any): Observable<any> {
  //   return this.apiService.get(`/api/Dashboard/GetAllRackByAisleIdForDashboard/${e}`);
  // }

  // getAllAsset(): Observable<any> {
  //   return this.apiService.get(`/api/Asset/GetAllAssets`);
  // }

  // getAllAssetStockIns(): Observable<any> {
  //   return this.apiService.get(`/api/AssetStockIn/GetAllAssetStockIns`);
  // }
}
