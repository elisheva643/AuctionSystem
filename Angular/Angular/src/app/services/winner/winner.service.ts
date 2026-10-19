import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Winner } from '../../Models/winner_model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {

  private apiUrl = '/api/Winner';

  constructor(private http: HttpClient) {}

  drawWinners(): Observable<Winner[]> {
    return this.http.post<Winner[]>(`${this.apiUrl}/draw`, {});
  }

  getWinners(): Observable<Winner[]> {
    return this.http.get<Winner[]>(`${this.apiUrl}/draw`);
  }
  resetLottery(): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/reset`);
}
}
