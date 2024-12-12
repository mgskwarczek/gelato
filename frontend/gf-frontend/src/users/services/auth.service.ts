import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UserAuth } from '../interfaces/user-auth';
import { map } from 'rxjs';
import { User } from '../interfaces/user';

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class AuthService {
    private authUrl = 'http://localhost:8080/auth';
  
    constructor(private http: HttpClient) {}
  
    login(email: string, password: string): Observable<UserAuth> {
      const loginUrl = this.authUrl+'login';
      const loginRequest: LoginRequest = { email, password };
      return this.http.post<UserAuth>(loginUrl, loginRequest, {observe:'response',}).pipe(map((response: HttpResponse<UserAuth>)=>response.body as UserAuth));
  }

    resetPassword(email:string): Observable<any>{
      const params = new HttpParams().set('email', email);
      let resetPasswordUrl = this.authUrl + 'reset-password';

      return this.http.post<any>(resetPasswordUrl, params, {
        observe: 'response',
        responseType: 'text' as 'json',
      });
    }

    setToken(token: string): void{
     localStorage.setItem('jwtToken',token);
    }

    getToken(): string | null{
      return localStorage.getItem('jwtToken');
    }
    
    logout():void {
      localStorage.removeItem('jwtToken');
    }

    isLoggedIn(): boolean{
      return !!this.getToken();
    }

}
  