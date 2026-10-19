import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Register } from '../../Models/register_model';
import { Login } from '../../Models/login_model';
import { AuthResponse } from '../../Models/authResponse _model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = '/api/User';

  constructor(private http: HttpClient) { }
  login(login: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, login).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }
  register(register: Register): Observable<Register> {
    return this.http.post<Register>(`${this.apiUrl}/register`, register);
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

}
