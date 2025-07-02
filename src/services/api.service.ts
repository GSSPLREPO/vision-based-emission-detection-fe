// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   public apiUrl = environment.apiUrl;
//   constructor(private http: HttpClient) { }

//   private finalURL(endpoint: string) {
//     return `${this.apiUrl}${endpoint}`
//   }

//   getFile(endpoint: string, options?: any) {
//     return this.http.get(this.finalURL(endpoint), options);
//   }

//   get(endpoint: string = "", queryParams?: any): Observable<any> {
//     return this.http.get(this.finalURL(endpoint), { params: queryParams })
//   }

//   post(endpoint: string, body: any, queryParams?: any): Observable<any> {
//     return this.http.post(this.finalURL(endpoint), body, { params: queryParams })
//   }

//   put(endpoint: string, body?: any, queryParams?: any): Observable<any> {
//     return this.http.put(this.finalURL(endpoint), body , { params: queryParams })
//   }

//   delete(endpoint: string, queryParams?: any): Observable<any> {
//     return this.http.delete(this.finalURL(endpoint), { params: queryParams })
//   }
  
//   logout(): Observable<any> {
//     return this.http.get(`${this.apiUrl}api/Login/Logout`)
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { global_const } from '../config/global-constants'; // adjust if needed
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = environment.apiUrl;
 
  constructor(private http: HttpClient, private router: Router) { }
 
  private finalURL(endpoint: string) {
    return `${this.apiUrl}${endpoint}`;
  }
 
  getFile(endpoint: string, options?: any) {
    return this.http.get(this.finalURL(endpoint), options);
  }
 
  get(endpoint: string, queryParams?: any): Observable<any> {
    return this.http.get(this.finalURL(endpoint), { params: queryParams });
  }
 
  post(endpoint: string, body: any, queryParams?: any): Observable<any> {
    return this.http.post(this.finalURL(endpoint), body, { params: queryParams });
  }
 
  put(endpoint: string, body?: any, queryParams?: any): Observable<any> {
    return this.http.put(this.finalURL(endpoint), body, { params: queryParams });
  }
 
  delete(endpoint: string, queryParams?: any): Observable<any> {
    return this.http.delete(this.finalURL(endpoint), { params: queryParams });
  }
  
  getVersion(): Observable<any> {
    return this.http.get(this.finalURL("/api/Organization/GetSoftwareVersion"))
  }
 
  logout(): void {
    localStorage.removeItem(global_const.token); // same key used in authGuard
    this.router.navigate(['/login']);
  }
}
 