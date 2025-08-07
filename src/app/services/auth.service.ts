import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


private apiUrl = `${environment.api}`;
  constructor(private httpClient: HttpClient) {}
  login(email: string, password:string){
    return this.httpClient.post<{token: string}>(
      `${this.apiUrl}/auth/login`,
      { email, password})
      .pipe(tap(
        response => {
          localStorage.setItem('token',response.token)
        })
      );
  }
  logout(){
    localStorage.removeItem('token');
  }
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
  
}
